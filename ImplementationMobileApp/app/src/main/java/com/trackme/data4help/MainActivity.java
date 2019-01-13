package com.trackme.data4help;

import HttpClient.Data4HelpAsyncClient;
import HttpClient.Data4HelpJsonResponseHandler;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.*;
import com.loopj.android.http.RequestParams;
import com.trackme.data4help.Model.IRecyclerViewCallback;
import com.trackme.data4help.Model.PrivateRequest;
import cz.msebera.android.httpclient.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;

public class MainActivity extends AppCompatActivity implements IRecyclerViewCallback {

    private LinearLayout content;
    private RecyclerView recyclerView;
    private ArrayList<PrivateRequest> privateRequests;
    View recyclerViewLayout;

    //Used to parse json data coming from the server
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

    //Handles the bottom buttons click event

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
                    randomDataCreator();
                    return true;
            }
            return false;
        }
    };

    /**
     * Sends a new User Data entry generated randomly to the server
     */
    private void randomDataCreator() {
        Button createData = new Button(this);
        content.addView(createData);
        createData.setText("Generate Data");
        //onClick
        createData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                final RequestParams requestParams = new RequestParams();
                int hearthRate = (int)(Math.random() * 200 + 20);
                int minBloodPressure = (int)(Math.random() * 100 + 20);
                int maxBloodPressure = (int)(Math.random() * 140 + 80);
                if(minBloodPressure >= maxBloodPressure) maxBloodPressure = minBloodPressure + 30;
                double lat = (Math.random() * 9 + 8);
                double longit = (Math.random() * 43 + 42);
                Calendar cal = Calendar.getInstance();

                requestParams.add("hearthRate",String.valueOf(hearthRate));
                requestParams.add("minBloodPressure",String.valueOf(minBloodPressure));
                requestParams.add("maxBloodPressure",String.valueOf(maxBloodPressure));
                requestParams.add("lat",String.valueOf(lat));
                requestParams.add("long",String.valueOf(longit));
                requestParams.add("timeOfAcquisition",cal.getTime().toString());
                Log.v("params: ",requestParams.toString());


                //request to the server sending user data
                Data4HelpAsyncClient.post("/api/put_userdata",requestParams,new Data4HelpJsonResponseHandler(getApplicationContext()){
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        try {
                            Toast toast = Toast.makeText(getContext(),"",Toast.LENGTH_LONG);
                            if(response.getBoolean("result")){
                                toast.setText("success");
                            }else {
                                toast.setText("fail");
                            }
                            toast.show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }


                });
            }
        });
    }


    /**
     * Function used to draw on screen all private requests retrieved from the server
     */
    private void drawPrivateRequests() {

        Data4HelpAsyncClient.post("/api/access_requests",null,new Data4HelpJsonResponseHandler(this) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                updateRecyclerView(response);

            }
        });

    }

    //Parsing the Array of JSONObjects received from the server to an Array of PrivateRequest
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
        View scrollView = findViewById(R.id.scrollView);
        recyclerViewLayout = LayoutInflater.from(this).inflate(R.layout.recycler_view,null);
        recyclerView = (RecyclerView) recyclerViewLayout.findViewById(R.id.recyclerView);
        drawUserData();
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
    }

    /**
     * Draws user data retrieved from the server on the main view.
     */
    private void drawUserData(){
        Data4HelpAsyncClient.post("/api/userdata",null,new Data4HelpJsonResponseHandler(this) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                try {
                    for(int i = 0; i < response.length(); i++){
                        JSONObject row = response.getJSONObject(i);

                        for (String s: JSONUserDataFields) {
                            TextView textView = new TextView(getContext());
                            textView.setTextAppearance(R.style.TextAppearance_AppCompat_Subhead);
                            textView.setText("- " + s.split("_")[1] + ":\t" + row.getString(s));
                            content.addView(textView);
                        }
                        TextView textView = new TextView(getContext());
                        textView.setText("\n------------------------------\n");
                        content.addView(textView);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        });

    }

    /**
     * Updates the view containing all the private requests
     */
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
