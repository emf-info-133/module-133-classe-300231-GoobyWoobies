package apiclient.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:mysql://host.docker.internal:3307/mysql_rest1") // Remplace par ton URL de base de données
            .username("root") // Remplace par ton nom d'utilisateur DB
            .password("emf123") // Remplace par ton mot de passe DB
            .driverClassName("com.mysql.cj.jdbc.Driver") // Ou le driver que tu utilises
            .build();
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
