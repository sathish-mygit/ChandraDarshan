package com.sathish.utilites.chandra_darshan;

import androidx.annotation.Nullable;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnAdInspectorClosedListener;
import com.google.android.gms.ads.AdInspectorError;

@CapacitorPlugin(name = "AdInspector")
public class AdInspectorPlugin extends Plugin {

    @PluginMethod
    public void open(final PluginCall call) {
        if (getActivity() == null) {
            call.reject("Activity is not available");
            return;
        }

        getActivity().runOnUiThread(() ->
            MobileAds.openAdInspector(
                getContext(),
                new OnAdInspectorClosedListener() {
                    @Override
                    public void onAdInspectorClosed(@Nullable AdInspectorError error) {
                        if (error != null) {
                            call.reject(error.getMessage());
                        } else {
                            call.resolve();
                        }
                    }
                }
            )
        );
    }
}
