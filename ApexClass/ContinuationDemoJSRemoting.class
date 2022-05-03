/**
 * @Author		:		Jitendra Zaa
 * @Date		:		30 May 2017
 * @Desc		:		Demo of Continuation Server using Javascript remoting
 * 
 * */
public class ContinuationDemoJSRemoting {
    
    private static final String CALLOUT_URL = 'https://node-count.herokuapp.com/'; 
    private static Map<Integer,String> errors = null;
        
    private static void initializeErrorcodes(){
        if(errors == null){
            errors = new Map<Integer,String>();
            errors.put(2000,'The timeout was reached, and the server did not get a chance to respond.');
            errors.put(2001,'There was a connection failure.');
            errors.put(2002,'Exceptions occurred.');
            errors.put(2003,'The response hasn’t arrived (which also means that the Apex asynchronous callout framework hasn’t resumed).');
            errors.put(2004,'The response size is too large (greater than 1 MB).');
        } 
    }
    
    @RemoteAction
    public static Object callService(Integer count){  
        // Return it to the system for processing
        return constructCallout('callback1Respone',count);
    }
    
    public static Object callback1Respone(Object state) {
        HttpResponse response = Continuation.getResponse((String)state);  
        Integer statusCode = response.getStatusCode();
        if (statusCode >= 2000) {
            initializeErrorcodes();
            return 'Continuation error: ' + errors.get(statusCode);
        } 
        return response.getBody();
    }
    
    private static Object constructCallout(String callbackMethodName,Integer count){
        Continuation chainedContinuation = null;  
        chainedContinuation = new Continuation(60); 
        chainedContinuation.continuationMethod=callbackMethodName; 
        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint(CALLOUT_URL+count); 
        chainedContinuation.state = chainedContinuation.addHttpRequest(req); 
        return chainedContinuation;  
    } 
	
}