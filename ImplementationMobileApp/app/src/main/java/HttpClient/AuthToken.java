package HttpClient;

import org.json.JSONException;
import org.json.JSONObject;

public class AuthToken extends JSONObject {

    private static AuthToken token;
    private String email;
    private String password;

    /**
     * Private customers access token
     * @param email auth email
     * @param password auth password
     */
    private AuthToken (String email, String password) {
        this.email = email;
        this.password = password;
    }
    static AuthToken getToken(){
        return token;
    }
    public static void deleteToken(){
        token = null;
    }
    public static void createToken(String email,String password){
        token = new AuthToken(email,password);
    }

    String getEmail() {
        return email;
    }

    String getPassword() {
        return password;
    }
}
