package com.trackme.data4help;

import HttpClient.Data4HelpAsyncClient;
import HttpClient.Data4HelpJsonResponseHandler;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import com.loopj.android.http.RequestParams;
import com.trackme.data4help.Model.IRecyclerViewCallback;
import com.trackme.data4help.Model.PrivateRequest;
import cz.msebera.android.httpclient.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Console;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends AppCompatActivity implements IRecyclerViewCallback {

    private TextView mTextMessage;
    private LinearLayout content;
    private RecyclerView recyclerView;
    private ArrayList<PrivateRequest> privateRequests;
    View recyclerViewLayout;
    private View scrollView;
    private static final List<String> JSONUserDataFields = Collections.unmodifiableList(new ArrayList<String>() {
        {
            add("_hearthRate");
            add("_maxBloodPressure");
            add("_minBloodPressure");
            add("_lat");
            add("_long");
            add("_timeOfAcquisition");

        }
    });

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    setTitle(R.string.title_home);
                    content.removeAllViews();
                    drawUserData();
                    return true;
                case R.id.navigation_requests:
                    setTitle(R.string.title_requests);
                    content.removeAllViews();
                    content.addView(recyclerViewLayout);
                    drawPrivateRequests();
                    return true;
                case R.id.navigation_send_user_data:
                    setTitle(R.string.title_send_data);
                    content.removeAllViews();
                    return true;
            }
            return false;
        }
    };


    private void drawPrivateRequests() {

        Data4HelpAsyncClient.post("/api/access_requests",null,new Data4HelpJsonResponseHandler(this) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                updateRecyclerView(response);

            }
        });

    }
    public ArrayList<PrivateRequest> parseData(ArrayList<JSONObject> data){
        ArrayList<PrivateRequest>privateRequests = new ArrayList<>();
        SimpleDateFormat sdf1 = new SimpleDateFormat("dd-MM-yyyy");
        for (JSONObject x: data) {

            try {
                java.util.Date date = sdf1.parse(x.getString("timestamp"));
                privateRequests.add(new PrivateRequest(
                        date,
                        x.getString("BusinessCustomers_email"),
                        x.getString("PrivateCustomers_email"),
                        x.getInt("accepted")));
            } catch (JSONException | ParseException e) {
                e.printStackTrace();
            }

        }
        return privateRequests;
    }
    private void createRecyclerView(ArrayList<PrivateRequest> data){
        privateRequests = data;
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        RequestsAdapter radapter = new RequestsAdapter(data, this);
        recyclerView.setAdapter(radapter);
        recyclerView.setHasFixedSize(true);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        content = findViewById(R.id.content);
        scrollView = findViewById(R.id.scrollView);
        recyclerViewLayout = LayoutInflater.from(this).inflate(R.layout.recycler_view,null);
        recyclerView = (RecyclerView) recyclerViewLayout.findViewById(R.id.recyclerView);
        drawUserData();
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
    }

    private void drawUserData(){
        Data4HelpAsyncClient.post("/api/userdata",null,new Data4HelpJsonResponseHandler(this) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                try {
                    for(int i = 0; i < response.length(); i++){
                        JSONObject row = response.getJSONObject(i);

                        for (String s: JSONUserDataFields) {
                            TextView textView = new TextView(getContext());
                            textView.setText(s + ": " + row.getString(s));
                            content.addView(textView);
                        }
                        TextView textView = new TextView(getContext());
                        textView.setText("------------------------------");
                        content.addView(textView);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        });

    }
    private void updateRecyclerView(JSONArray response){
        ArrayList<JSONObject> data = new ArrayList<>();
        if(response.length() != 0) {
            try {
                for (int i = 0; i < response.length(); i++) {
                    data.add(response.getJSONObject(i));
                }
                createRecyclerView(parseData(data));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onClick(View v, int pos) {
        if(privateRequests != null) {
            Log.v("onClick: ", privateRequests.get(pos).getBCEmail());
            RequestParams params = new RequestParams();
            params.add("BCEmail",privateRequests.get(pos).getBCEmail());
            params.add("val",v.getId() == R.id.buttonDeny ? "0" : "1");
            Data4HelpAsyncClient.post("/api/access_requests/set_status",params,new Data4HelpJsonResponseHandler(this) {
                @Override
                public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                    updateRecyclerView(response);

                }
            });
        }
    }
}
