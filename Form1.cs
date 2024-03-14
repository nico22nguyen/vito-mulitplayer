namespace Test;

public partial class Form1 : Form
{
    private WebBrowser? browser;
    private System.Windows.Forms.Timer timer;
    public Form1()
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
        browser.Navigate("file:///C:/Users/Nico/Desktop/school/network programming/Project/Test/vito.html");
        browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(documentLoadEventHandler);
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
        Console.WriteLine("moving...");
        browser.Document.InvokeScript("moveVitoX", [5]);
        object? vitoX = browser.Document.InvokeScript("getVitoX");
        Console.WriteLine("vito current x: " + vitoX);
    }
}
