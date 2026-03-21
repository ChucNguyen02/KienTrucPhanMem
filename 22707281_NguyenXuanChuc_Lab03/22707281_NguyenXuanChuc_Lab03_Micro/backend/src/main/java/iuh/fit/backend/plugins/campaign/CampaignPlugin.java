package iuh.fit.backend.plugins.campaign;

import iuh.fit.backend.kernel.PluginModule;
import org.springframework.stereotype.Component;

@Component
public class CampaignPlugin implements PluginModule {

    @Override
    public String pluginId() {
        return "campaign-manager";
    }

    @Override
    public String pluginName() {
        return "Campaign Manager";
    }
}

