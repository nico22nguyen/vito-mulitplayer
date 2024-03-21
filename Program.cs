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
		/*
		if (args.Length == 0) {
			Console.WriteLine("Missing argument. Either specify -host or provide the IP of the host to join");
			return;
		}
		*/
		bool host = false;
		IPAddress otherIP;
		if (host) {//args[0].Equals("-host")) {
			host = true;
			otherIP = IPAddress.Any;
		} else {
			host = false;
			otherIP = IPAddress.Parse("127.0.0.1");
		}
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();
        Application.Run(new Form1(host, otherIP));
    }    
}