package iuh.fit.backend.kernel;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class PluginRegistryService {

    private final List<PluginModule> pluginModules;

    public PluginRegistryService(List<PluginModule> pluginModules) {
        this.pluginModules = pluginModules.stream()
                .sorted(Comparator.comparing(PluginModule::pluginId))
                .toList();
    }

    public List<PluginModule> getPluginModules() {
        return pluginModules;
    }
}

