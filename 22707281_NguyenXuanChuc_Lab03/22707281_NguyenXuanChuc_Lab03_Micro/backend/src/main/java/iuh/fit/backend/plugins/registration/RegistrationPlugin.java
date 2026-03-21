package iuh.fit.backend.plugins.registration;

import iuh.fit.backend.kernel.PluginModule;
import org.springframework.stereotype.Component;

@Component
public class RegistrationPlugin implements PluginModule {

    @Override
    public String pluginId() {
        return "registration-attendance";
    }

    @Override
    public String pluginName() {
        return "Registration & Attendance";
    }
}

