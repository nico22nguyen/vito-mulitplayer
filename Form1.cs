namespace Test;
using System.Net;
using System.Net.Sockets;
using System.Reflection;

public partial class Form1 : Form
{
    private WebBrowser? browser;
    private System.Windows.Forms.Timer timer;
    private Socket socket;
    private EndPoint Remote;
    public Form1(bool host, IPAddress otherIP)
    {
        InitializeComponent();

        timer = new System.Windows.Forms.Timer();
        timer.Tick += new EventHandler(TimerEventProcessor);
        timer.Interval = 1000 / 40;

        browser = new WebBrowser
        {
            Dock = DockStyle.Fill
        };
        Controls.Add(browser);
        string htmlPath = Path.Combine(getProjectRootDir(), "vito.html");
        browser.Navigate(htmlPath);
        browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(documentLoadEventHandler);
        byte[] data = new byte[1024];
        IPEndPoint ipep = new IPEndPoint(otherIP, 9050);

        socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);

        if (host) {
            // host binds to port
            socket.Bind(ipep);
            Console.WriteLine("Waiting for another player to connect...");
        } else {
            // send message to start connection
            // doesnt work if server isnt listening yet... need to have acknowledgement or something
            socket.SendTo(data, 0, SocketFlags.None, ipep);
            Console.WriteLine("sent empty message");
        }
        Remote = new IPEndPoint(IPAddress.Any, 0);
    }

    private static string getProjectRootDir() {
        string toRemove = "bin\\Debug\\net8.0-windows\\";
        string basePath = Application.StartupPath;
        string projectRoot = basePath.Substring(0, basePath.Length - toRemove.Length);
        return projectRoot;
    }

    // handle when document loads, we can now call js functions
    private void documentLoadEventHandler(object? sender, WebBrowserDocumentCompletedEventArgs e) {
        Console.WriteLine("This is handler");

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
        // some null checks to make sure we can access properties
        if (browser == null) {
            Console.WriteLine("Browser is null");
            return;
        }
        if (browser.Document == null) {
            Console.WriteLine("browser.Document is null");
            return;
        }

        // declare vars
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
        Console.WriteLine("recieved x: " + BitConverter.ToInt32(x_bytes) + ", y: " + BitConverter.ToInt32(y_bytes) + ", dir: " + BitConverter.ToInt32(dir_bytes));
        browser.Document.InvokeScript("updateOtherVito", [BitConverter.ToInt32(x_bytes), BitConverter.ToInt32(y_bytes), BitConverter.ToInt32(dir_bytes)]);

        /* HOW TO COORDINATE PLATFORMS WITH CLIENT*/
        /* get platforms (as string) using `getPlatforms` js method */
        /* DO NOT MODIFY THE STRING */
        /* send this string directly to the client */
        /* on the client side, simply pass the string to js using `setPlatforms` and it will parse it correctly */
        /* all this should happen in the setup phase with the client, NOT in the actual game loop since this only needs to happen once */

        /* Here's some examples of how to call the js functions */
        object? plats_string = browser.Document.InvokeScript("getPlatforms"); // you will send this to client over networks
        string test_plats = "[{\"x\": 1, \"y\": 2}, {\"x\": 3, \"y\": 4}]"; // pretend this is what we (client) received from server
        browser.Document.InvokeScript("setPlatforms", [test_plats]); // this is how you give it to client's js code
    
        // (3) get our vito's state from js
        object? _vitoX = browser.Document.InvokeScript("getVitoX");
        object? _vitoY = browser.Document.InvokeScript("getVitoY");
        object? _vitoDir = browser.Document.InvokeScript("getVitoDirection");
        int vitoX = int.Parse(_vitoX.ToString());
        int vitoY = int.Parse(_vitoY.ToString());
        int vitoDir = int.Parse(_vitoDir.ToString());

        // convert state values (ints) to bytes for transmission
        x_bytes = BitConverter.GetBytes(vitoX);
        y_bytes = BitConverter.GetBytes(vitoY);
        dir_bytes = BitConverter.GetBytes(vitoDir);

        // (4) send our vito's state to other player
        Console.WriteLine("sending x: " + vitoX + ", y: " + vitoY + ", dir: " + vitoDir);
        vito_state = x_bytes.Concat(y_bytes).Concat(dir_bytes).ToArray();
        socket.SendTo(vito_state, Remote);
    }
}
