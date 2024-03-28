namespace Test;
using System.Net;
using System.Net.Sockets;

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
        timer.Interval = 1000 / 40;
        timer.Start();
    }

    /** 
     * This is our 'tick' function, it should look like:
     * 1. Get OUR character's position from js
     * 2. Send to other player over network
     * 3. Receive other player's position over network
     * 4. Set OTHER character's position in js
     * 
     * Ideally the rate should match the js draw rate to avoid jitteriness in the game, we could even pull it directly from the js code
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

        // right now, just a proof of concept.
        // first function moves the player, second function gets his position
        // shows that we are able to read and write successfully from the JS
        // shouldnt be too difficult to go from here to the final product
        // we are just missing the networking aspect, which should be just sending the position back and forth over the network
        // maybe also a victory message to end the game for both players, but the clients could deduce that on their own also
        
        byte[] x_bytes;
        byte[] y_bytes;
        byte[] dir_bytes;
        byte[] vito_state;

        vito_state = new byte[12];
        socket.ReceiveFrom(vito_state, ref Remote);
        x_bytes = vito_state.Take(4).ToArray();
        y_bytes = vito_state.Skip(4).Take(4).ToArray();
        dir_bytes = vito_state.TakeLast(4).ToArray();

        Console.WriteLine("recieved x: " + BitConverter.ToInt32(x_bytes) + ", y: " + BitConverter.ToInt32(y_bytes) + ", dir: " + BitConverter.ToInt32(dir_bytes));
        browser.Document.InvokeScript("updateOtherVito", [BitConverter.ToInt32(x_bytes), BitConverter.ToInt32(y_bytes), BitConverter.ToInt32(dir_bytes)]);
    
        object? _vitoX = browser.Document.InvokeScript("getVitoX");
        object? _vitoY = browser.Document.InvokeScript("getVitoY");
        object? _vitoDir = browser.Document.InvokeScript("getVitoDirection");
        int vitoX = int.Parse(_vitoX.ToString());
        int vitoY = int.Parse(_vitoY.ToString());
        int vitoDir = int.Parse(_vitoDir.ToString());
        Console.WriteLine("sending x: " + vitoX + ", y: " + vitoY + ", dir: " + vitoDir);
        x_bytes = BitConverter.GetBytes(vitoX);
        y_bytes = BitConverter.GetBytes(vitoY);
        dir_bytes = BitConverter.GetBytes(vitoDir);
        vito_state = x_bytes.Concat(y_bytes).Concat(dir_bytes).ToArray();
        socket.SendTo(vito_state, Remote);
    }
}
