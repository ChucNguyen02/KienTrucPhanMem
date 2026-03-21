package iuh.fit.backend.kernel;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plugins")
public class PluginController {

    private final PluginRegistryService pluginRegistryService;

    public PluginController(PluginRegistryService pluginRegistryService) {
        this.pluginRegistryService = pluginRegistryService;
    }

    @GetMapping
    public List<PluginInfoResponse> getPlugins() {
        return pluginRegistryService.getPluginModules().stream()
                .map(module -> new PluginInfoResponse(module.pluginId(), module.pluginName()))
                .toList();
    }

    public record PluginInfoResponse(String id, String name) {
    }
}

