public with sharing class ContinuationController {

        @TestVisible
        private static String continuationState; // IMPORTANT: Variable used for testing, containing the value of the Continuation.state  
        public String result {get;set;}
        //private static final String LONG_RUNNING_SERVICE_URL = 'https://long-running.herokuapp.com/products?latency=2000';
        private static final String LONG_RUNNING_SERVICE_URL = 'callout:LongRunningEndPoint';
        private final static Integer CONTINUATION_TIMEOUT_IN_SECONDS = 40;
        public Boolean statusBool {get;set;}
    
        public ContinuationController() {

        }
       
        // Action method
        @AuraEnabled(continuation=true)
        public static Object startConinuation(Integer counter, Integer latency) {
            HttpRequest req = new HttpRequest();
            req.setMethod('GET');
            //https://long-running.herokuapp.com/products/9?latency=500

            String para = String.valueof(counter) + '?latency=' + String.valueof(latency);
            String URL = LONG_RUNNING_SERVICE_URL + '/products/'+ para;
            System.debug('@@@URL : ' + URL);
            req.setEndpoint(URL);


            Continuation con = new Continuation(CONTINUATION_TIMEOUT_IN_SECONDS);
            // Set callback method
            con.continuationMethod='continuationCallback';
            continuationState = con.addHttpRequest(req); // Store the HttRequest and make it accessible for a test-context
            con.state = continuationState;
        
            return con;  
        }
    
        // Callback method 
        @AuraEnabled()
        public static Object continuationCallback(Object state) {
            HttpResponse response = Continuation.getResponse((String) state);
        
            Integer statusCode = response.getStatusCode();
            if (statusCode == 200) {
              return response.getBody();
            } else if (statusCode >= 2000) {
              // Continuation error
              throw new AuraHandledException(
                'Continuation Error: ' +
                statusCode +
                ' - ' +
                response.getBody()
              );
            } else {
              // Http Request error
              throw new AuraHandledException(
                'HTTP Request Error: ' +
                statusCode +
                ' - ' +
                response.getBody()
              );
            }
        }
}