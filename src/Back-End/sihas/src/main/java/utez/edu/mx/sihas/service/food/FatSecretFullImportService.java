    package utez.edu.mx.sihas.service.food;

    import com.fasterxml.jackson.databind.JsonNode;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.node.ArrayNode;
    import com.fasterxml.jackson.databind.node.ObjectNode;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.*;
    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;
    import utez.edu.mx.sihas.model.food.Food;
    import utez.edu.mx.sihas.model.food.FoodRepository;

    import java.util.ArrayList;
    import java.util.Base64;
    import java.util.List;

    @Service
    public class FatSecretFullImportService {

        @Value("${client.id}")
        private String clientId;
        @Value("${client.secret}")
        private String clientSecret;

        @Value("${libretranslate.url:}")
        private String libreUrl;


        @Autowired
        private final FoodRepository foodRepository;

        private final RestTemplate restTemplate = new RestTemplate();
        private final ObjectMapper mapper = new ObjectMapper();

        public FatSecretFullImportService(FoodRepository foodRepository) {
            this.foodRepository = foodRepository;
        }

        private String getAccessToken() throws Exception {
            String auth = clientId + ":" + clientSecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedAuth);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            String body = "grant_type=client_credentials&scope=basic";
            HttpEntity<String> request = new HttpEntity<>(body, headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    "https://oauth.fatsecret.com/connect/token",
                    HttpMethod.POST,
                    request,
                    JsonNode.class
            );
            return response.getBody().get("access_token").asText();
        }

        /**
         * Traduce en lote una lista de textos usando LibreTranslate.
         * Si falla, devuelve la lista original (fallback seguro).
         */
        private List<String> translateBatch(List<String> texts) {
            if (libreUrl == null || libreUrl.isBlank()) return texts;
            List<String> out = new ArrayList<>();

            for (String text : texts) {
                try {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    ObjectNode body = mapper.createObjectNode();
                    body.put("q", text);
                    body.put("source", "en");
                    body.put("target", "es");

                    String endpoint = libreUrl.endsWith("/")
                            ? libreUrl + "translate"
                            : libreUrl + "/translate";

                    HttpEntity<String> request = new HttpEntity<>(mapper.writeValueAsString(body), headers);
                    ResponseEntity<JsonNode> resp = restTemplate.exchange(
                            endpoint,
                            HttpMethod.POST,
                            request,
                            JsonNode.class
                    );

                    if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null && resp.getBody().has("translatedText")) {
                        out.add(resp.getBody().path("translatedText").asText());
                    } else {
                        out.add(text);
                    }
                } catch (Exception e) {
                    out.add(text);
                }
            }
            return out;
        }




        public void importFoodsWithFiber(String searchTerm, int page) throws Exception {
            String token = getAccessToken();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = "https://platform.fatsecret.com/rest/server.api" +
                    "?method=foods.search" +
                    "&search_expression=" + searchTerm +
                    "&page_number=" + page +
                    "&format=json";

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
            JsonNode foods = response.getBody().path("foods").path("food");

            if (foods.isArray() && foods.size() > 0) {
                // recolectar ids y nombres para traducir en lote
                List<Long> ids = new ArrayList<>();
                List<String> names = new ArrayList<>();
                for (JsonNode foodNode : foods) {
                    ids.add(foodNode.path("food_id").asLong());
                    names.add(foodNode.path("food_name").asText());
                }

                // Traducción en lote (si libretranslate configurado). Si falla, devuelve names originales.
                List<String> translatedNames = translateBatch(names);

                for (int i = 0; i < ids.size(); i++) {
                    Long foodId = ids.get(i);
                    String name = (translatedNames.size() > i && translatedNames.get(i) != null && !translatedNames.get(i).isBlank())
                            ? translatedNames.get(i)
                            : names.get(i);

                    // truncar para evitar problemas con la DB
                    if (name.length() > 100) name = name.substring(0, 100);

                    Food foodEntity = getFoodDetails(foodId, token);
                    if (foodEntity != null) {
                        foodEntity.setName(name);
                        foodEntity.setQuantity(100); // por 100g
                        foodRepository.save(foodEntity);
                    }
                }
            }
        }

        private Food getFoodDetails(Long foodId, String token) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + token);
                HttpEntity<String> entity = new HttpEntity<>(headers);
                String url = "https://platform.fatsecret.com/rest/server.api" +
                        "?method=food.get" +
                        "&food_id=" + foodId +
                        "&format=json";

                ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);

                JsonNode serving = response.getBody()
                        .path("food")
                        .path("servings")
                        .path("serving");

                JsonNode firstServing = serving.isArray() ? serving.get(0) : serving;

                // nunca null: valores por defecto 0.0 si no vienen
                Double calories = parseOrZero(firstServing.path("calories").asText(""));
                Double proteins = parseOrZero(firstServing.path("protein").asText(""));
                Double fats = parseOrZero(firstServing.path("fat").asText(""));
                Double carbs = parseOrZero(firstServing.path("carbohydrate").asText(""));
                Double fiber = parseOrZero(firstServing.path("fiber").asText(""));

                return new Food(null, 100, calories, proteins, fats, fiber, carbs);
            } catch (Exception e) {
                return null;
            }
        }

        private Double parseOrZero(String value) {
            try {
                if (value == null || value.isBlank()) return 0.0;
                return Double.parseDouble(value);
            } catch (Exception e) {
                return 0.0;
            }
        }

        public void bulkImportAll() throws Exception {
            String[] terms = {"a","b","c","d","e","f","g","h","i","j","k",
                    "l","m","n","o","p","q","r","s","t","u","v",
                    "w","x","y","z"};
            for (String term : terms) {
                for (int page = 0; page < 5; page++) {
                    importFoodsWithFiber(term, page);
                    Thread.sleep(500);
                }
            }
        }
    }
