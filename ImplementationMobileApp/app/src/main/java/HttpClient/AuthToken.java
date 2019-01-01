package HttpClient;

import org.json.JSONException;
import org.json.JSONObject;

public class AuthToken extends JSONObject {

    private static AuthToken token;
    private String email;
    private String password;

    private AuthToken (String email, String password) {
        this.email = email;
        this.password = password;
    }
    public static AuthToken getToken(){
        return token;
    }
    public static void createToken(String email,String password){
        token = new AuthToken(email,password);
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
