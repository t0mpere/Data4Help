package HttpClient;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.ResponseHandlerInterface;

public class Data4HelpAsyncClient {
    private static final String BASE_URL = "http://192.168.1.12:3000";
    private static AsyncHttpClient client = new AsyncHttpClient();

    public static void post(String url, RequestParams requestParams, ResponseHandlerInterface responseHandlerInterface){
        if(AuthToken.getToken() == null){
            client.post(BASE_URL + url, requestParams,responseHandlerInterface);
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
