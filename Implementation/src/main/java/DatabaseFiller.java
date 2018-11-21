import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;

public class DatabaseFiller {
    public static void main(String[] args) {
        Statement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        String line;
        BufferedReader in;


        try {
            conn = DriverManager.getConnection("jdbc:mysql://data4help.c7wcescuyowm.eu-west-2.rds.amazonaws.com?" +
                    "user=user&password=viacarnia");
            stmt = conn.createStatement();

            in = new BufferedReader(new FileReader("src/emails.txt"));
            line = in.readLine();

            while(line != null)
            {
                try {
                System.out.println(line);
                line = in.readLine();

                if (stmt.execute("insert into Data4Help.PrivateCustomers values ('"+line+"','psw',default ,default )")) {
                    System.out.println("added: "+line);
                }
                } catch (SQLException ex) {
                    // handle any errors
                    System.out.println("SQLException: " + ex.getMessage());
                    System.out.println("SQLState: " + ex.getSQLState());
                    System.out.println("VendorError: " + ex.getErrorCode());
                }
            }


        }catch (Exception ex){
            System.out.println("FileEx: " + ex.getMessage());
        }
    }
}
