package com.trackme.data4help;

import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import com.trackme.data4help.Model.IRecyclerViewCallback;
import com.trackme.data4help.Model.PrivateRequest;
import java.util.ArrayList;

/**
 * Class holding data and view components of a private request.
 */
public class RequestsAdapter extends RecyclerView.Adapter<RequestsAdapter.requestViewHolder> {

    private IRecyclerViewCallback listner;
    private ArrayList<PrivateRequest> privateRequests;

    public static class requestViewHolder extends RecyclerView.ViewHolder {
        public Button acceptButton;
        public Button denyButton;
        public TextView businessCustomerEmail;
        public TextView timestamp;
        public ConstraintLayout row;
        // each privateRequests item is just a string in this case
        public requestViewHolder(View itemView, final IRecyclerViewCallback listener) {
            super(itemView);

            row = itemView.findViewById(R.id.requestElem);
            acceptButton = itemView.findViewById(R.id.buttonAccept);
            denyButton = itemView.findViewById(R.id.buttonDeny);
            businessCustomerEmail = itemView.findViewById(R.id.businessCustomerEmail);
            timestamp = itemView.findViewById(R.id.request_timestamp);
            View.OnClickListener clickListener = new View.OnClickListener(){
                @Override
                public void onClick(View v) {
                    listener.onClick(v,getAdapterPosition());
                }
            };
            acceptButton.setOnClickListener(clickListener);
            denyButton.setOnClickListener(clickListener);

        }
    }


    public RequestsAdapter(ArrayList<PrivateRequest> data, IRecyclerViewCallback listener){
        super();
        this.privateRequests = data;
        this.listner = listener;

    }

    @NonNull
    @Override
    public requestViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        LayoutInflater inflater = LayoutInflater.from(viewGroup.getContext());

        View view = inflater.inflate(R.layout.request_elem, viewGroup, false);

        return new requestViewHolder(view,listner);
    }

    @Override
    public void onBindViewHolder(@NonNull requestViewHolder requestViewHolder, int i) {
        Log.v("binding...",privateRequests.get(i).getBCEmail());
        TextView textView = requestViewHolder.businessCustomerEmail;
        textView.setText("From: "+privateRequests.get(i).getBCEmail());
        TextView timestamp = requestViewHolder.timestamp;
        timestamp.setText("Time: " + privateRequests.get(i).getDate().toString());
        requestViewHolder.acceptButton.setEnabled(!privateRequests.get(i).getAccepted());
    }


    @Override
    public int getItemCount() {
        return privateRequests.size();
    }
}
