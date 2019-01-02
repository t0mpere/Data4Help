package HttpClient;

import android.content.Context;
import com.loopj.android.http.JsonHttpResponseHandler;
import cz.msebera.android.httpclient.Header;

public class Data4HelpJsonResponseHandler extends JsonHttpResponseHandler {
    public Context getContext() {
        return context;
    }

    private Context context;
    public Data4HelpJsonResponseHandler(Context context) {
        this.context = context;
    }

    @Override
    public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
        Data4HelpAsyncClient.onError(context,statusCode,responseString,throwable);
    }
}
