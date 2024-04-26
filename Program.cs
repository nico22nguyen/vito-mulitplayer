namespace Test;
using System.Net;

static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {
		
		bool host = false; // switch to true to host
		IPAddress otherIP;
		if (host) {
			otherIP = IPAddress.Any;
		} else {
			otherIP = IPAddress.Parse("127.0.0.1");
		}
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();
        Application.Run(new Form1(host, otherIP));
    }    
}