package iuh.fit.backend.plugins.points;

import iuh.fit.backend.kernel.PluginModule;
import org.springframework.stereotype.Component;

@Component
public class PointsPlugin implements PluginModule {

    @Override
    public String pluginId() {
        return "points-reporting";
    }

    @Override
    public String pluginName() {
        return "Points & Reporting";
    }
}

