namespace Test;
using System.Net;
using System.Net.Sockets;
using System.Text;

public partial class Form1 : Form
{
    private bool isHost;
    private WebBrowser? browser;
    private Socket socket;
    private EndPoint Remote;
    private IPEndPoint ipep;
    public Form1(bool host, IPAddress otherIP)
    {
        InitializeComponent();
        isHost = host;

        // set up network references used for communication    
        ipep = new IPEndPoint(otherIP, 9050);
        socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        Remote = new IPEndPoint(IPAddress.Any, 0);

        // initialize browser and load html
        browser = new WebBrowser
        {
            Dock = DockStyle.Fill
        };
        Controls.Add(browser);
        string htmlPath = Path.Combine(getProjectRootDir(), "vito.html");
        browser.Navigate(htmlPath);
        browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(documentLoadEventHandler);
    }

    private static string getProjectRootDir() {
        string toRemove = "bin\\Debug\\net8.0-windows\\";
        string basePath = Application.StartupPath;
        string projectRoot = basePath.Substring(0, basePath.Length - toRemove.Length);
        return projectRoot;
    }

    // do all error checks around InvokeScript
    private object safeInvoke(string scriptName) {
        if (browser == null)  throw new Exception("Browser is null");
        if (browser.Document == null) throw new Exception("browser.Document is null");
        if (scriptName.Length == 0) throw new Exception("Expected function name as argument");

        object? result = browser.Document.InvokeScript(scriptName);
        if (result == null) throw new Exception("InvokeScript(" + scriptName + ") returned null");

        return result;
    }

    // handle when document loads, we can now call js functions
    private void documentLoadEventHandler(object? sender, WebBrowserDocumentCompletedEventArgs e) {
        if (browser == null)  throw new Exception("Browser is null");
        if (browser.Document == null) throw new Exception("browser.Document is null");

        byte[] data = new byte[1024];
        if (isHost) {
            // host binds to port
            socket.Bind(ipep);

            // listen for init message from client
            socket.ReceiveFrom(data, ref Remote);

            // get platforms from document
            object plats_obj = safeInvoke("getPlatforms");
            string plats_string = plats_obj.ToString() ?? "";

            // convert platform data to bytes
            byte[] platStringLength = BitConverter.GetBytes(plats_string.Length);
            byte[] platBytes = Encoding.ASCII.GetBytes(plats_string);

            // send platform message in the format: [string length (4 bytes), platform string ({strLength} bytes)] 
            socket.SendTo(platStringLength.Concat(platBytes).ToArray(), Remote);
        } else {
            // server is waiting for message, send something to "wake it up"
            socket.SendTo(data, 0, SocketFlags.None, ipep);

            /* server will first send platform data so that players play on the same randomly generated layout */
            byte [] platData = new byte[2048];
            socket.ReceiveFrom(platData, ref Remote);

            // first 4 bytes are platform JSON string length
            byte[] platStringLengthBytes = platData.Take(4).ToArray();
            int platStringLength = BitConverter.ToInt32(platStringLengthBytes);

            // get all platform string bytes
            byte[] platBytes = platData.Skip(4).Take(platStringLength).ToArray();
            string plats_string = Encoding.ASCII.GetString(platBytes);

            // set the platforms in document
            browser.Document.InvokeScript("setPlatforms", [plats_string]);

            // server is listening for our player position, send (0, 0)
            socket.SendTo(data, 0, SocketFlags.None, ipep);
        }

        var timer = new System.Windows.Forms.Timer();
        timer.Tick += new EventHandler(TimerEventProcessor);
        timer.Interval = 1000 / 40; // Ideally the rate should match the js draw rate to avoid jitteriness in the game, we could even pull it directly from the js code
        timer.Start();
    }

    /** 
     * This is our 'tick' function, it should look like:
     * 1. Receive other player's position over network
     * 2. Set OTHER character's position in js
     * 3. Get OUR character's position from js
     * 4. Send to other player over network
    */ 
    private void TimerEventProcessor(object? myObject, EventArgs myEventArgs) {
        if (browser == null)  throw new Exception("Browser is null");
        if (browser.Document == null) throw new Exception("browser.Document is null");
        byte[] x_bytes;
        byte[] y_bytes;
        byte[] dir_bytes;
        byte[] vito_state;

        // (1) receive other vito state from other player
        vito_state = new byte[12];
        socket.ReceiveFrom(vito_state, ref Remote);

        // break state into usable values
        x_bytes = vito_state.Take(4).ToArray();
        y_bytes = vito_state.Skip(4).Take(4).ToArray();
        dir_bytes = vito_state.TakeLast(4).ToArray();

        // (2) update other vito state in our js
        browser.Document.InvokeScript("updateOtherVito", [BitConverter.ToInt32(x_bytes), BitConverter.ToInt32(y_bytes), BitConverter.ToInt32(dir_bytes)]);
    
        // (3) get our vito's state from js
        int vitoX = (int) safeInvoke("getVitoX");
        int vitoY = (int) safeInvoke("getVitoY");
        int vitoDir = (int) safeInvoke("getVitoDirection");

        // convert state values (ints) to bytes for transmission
        x_bytes = BitConverter.GetBytes(vitoX);
        y_bytes = BitConverter.GetBytes(vitoY);
        dir_bytes = BitConverter.GetBytes(vitoDir);

        // (4) send our vito's state to other player
        vito_state = x_bytes.Concat(y_bytes).Concat(dir_bytes).ToArray();
        socket.SendTo(vito_state, Remote);
    }
}
