package HttpClient;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.ResponseHandlerInterface;
import org.json.JSONObject;

import java.util.HashMap;

public class Data4HelpAsyncClient {
    public static String BASE_URL = "http://localhost:3000";
    private static AsyncHttpClient client = new AsyncHttpClient();

    public static void post(String url, RequestParams requestParams, ResponseHandlerInterface responseHandlerInterface){
        if(AuthToken.getToken() == null){
            client.post(BASE_URL + url, new RequestParams(requestParams),responseHandlerInterface);
        }else{
            //merging params
            AuthToken authToken = AuthToken.getToken();
            if(requestParams == null){
                requestParams = new RequestParams();
            }
           requestParams.put("email",authToken.getEmail());
           requestParams.put("password",authToken.getPassword());
            client.post(BASE_URL + url, requestParams,responseHandlerInterface );
        }

    }
}
