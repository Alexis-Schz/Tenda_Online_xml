import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.regex.*;
import javax.xml.XMLConstants;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.*;
import javax.xml.validation.SchemaFactory;
import org.w3c.dom.*;
import javax.xml.parsers.*;

public class XmlServer {
  static final Path ROOT = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
  static final int PORT = 8080;
  static final DocumentBuilderFactory DBF = DocumentBuilderFactory.newInstance();
  public static void main(String[] args) throws Exception { HttpServer server=HttpServer.create(new InetSocketAddress("localhost",PORT),0); server.createContext("/",XmlServer::handle); server.start(); System.out.println("NexoMarket XML iniciado en http://localhost:"+PORT); System.out.println("Presiona Ctrl+C para detenerlo."); }
  static void handle(HttpExchange ex) { try { String path=ex.getRequestURI().getPath();
    if(path.equals("/api/catalogo")&&ex.getRequestMethod().equals("GET")){Document d=load("data/catalogo.xml");validate(d,"data/catalogo.xsd");send(ex,xml(d),"application/xml",200);return;}
    if(path.equals("/api/usuarios")&&ex.getRequestMethod().equals("GET")){Document d=load("data/usuarios.xml");validate(d,"data/usuarios.xsd");send(ex,xml(d),"application/xml",200);return;}
    if(path.equals("/api/catalogo-html")&&ex.getRequestMethod().equals("GET")){Transformer t=TransformerFactory.newInstance().newTransformer(new StreamSource(file("data/catalogo.xsl").toFile()));StringWriter out=new StringWriter();t.transform(new StreamSource(file("data/catalogo.xml").toFile()),new StreamResult(out));send(ex,out.toString(),"text/html",200);return;}
    if(path.equals("/api/productos")&&ex.getRequestMethod().equals("POST")){updateProduct(read(ex));send(ex,"{\"ok\":true}","application/json",200);return;}
    if(path.equals("/api/pedidos")&&ex.getRequestMethod().equals("POST")){Document order=loadXml(read(ex));validate(order,"data/pedidos.xsd");Document orders=load("data/pedidos.xml");orders.getDocumentElement().appendChild(orders.importNode(order.getDocumentElement(),true));validate(orders,"data/pedidos.xsd");save(orders,"data/pedidos.xml");send(ex,"{\"ok\":true}","application/json",200);return;}
    serveStatic(ex,path);
  }catch(Exception e){try{send(ex,e.getMessage()==null?"Error XML":e.getMessage(),"text/plain",500);}catch(Exception ignored){}}}
  static void updateProduct(String json)throws Exception{Document d=load("data/catalogo.xml");String action=field(json,"action"),id=field(json,"id");Element products=(Element)d.getElementsByTagName("productos").item(0),old=null;NodeList list=products.getElementsByTagName("producto");for(int i=0;i<list.getLength();i++)if(((Element)list.item(i)).getAttribute("id").equals(id))old=(Element)list.item(i);if(action.equals("eliminar")){if(old!=null)products.removeChild(old);}else{String name=field(json,"name"),category=field(json,"category").toLowerCase().replace("ó","o"),seller=field(json,"seller"),price=field(json,"price"),icon=field(json,"icon"),desc=field(json,"description");Element n=d.createElement("producto");n.setAttribute("id",id);n.setAttribute("categoria",category);n.setAttribute("icono",icon);child(d,n,"nombre",name);child(d,n,"descripcion",desc);Element p=child(d,n,"precio",price);p.setAttribute("moneda","MXN");child(d,n,"vendedor",seller);child(d,n,"stock","10");if(old==null)products.appendChild(n);else products.replaceChild(n,old);}validate(d,"data/catalogo.xsd");save(d,"data/catalogo.xml");}
  static String field(String json,String key){Matcher m=Pattern.compile("\\\""+Pattern.quote(key)+"\\\"\\s*:\\s*(?:\\\"([^\\\"]*)\\\"|([^,}]+))").matcher(json);return m.find()?(m.group(1)!=null?m.group(1):m.group(2).trim()):"";}
  static Element child(Document d,Element parent,String name,String value){Element e=d.createElement(name);e.setTextContent(value);parent.appendChild(e);return e;}
  static Document load(String relative)throws Exception{return loadXml(Files.readString(file(relative),StandardCharsets.UTF_8));}
  static Document loadXml(String text)throws Exception{return DBF.newDocumentBuilder().parse(new ByteArrayInputStream(text.getBytes(StandardCharsets.UTF_8)));}
  static void validate(Document d,String schema)throws Exception{SchemaFactory sf=SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);sf.newSchema(file(schema).toFile()).newValidator().validate(new DOMSource(d));}
  static String xml(Document d)throws Exception{Transformer t=TransformerFactory.newInstance().newTransformer();StringWriter out=new StringWriter();t.transform(new DOMSource(d),new StreamResult(out));return out.toString();}
  static void save(Document d,String relative)throws Exception{Files.writeString(file(relative),xml(d),StandardCharsets.UTF_8);}
  static String read(HttpExchange ex)throws IOException{return new String(ex.getRequestBody().readAllBytes(),StandardCharsets.UTF_8);}
  static Path file(String relative){return ROOT.resolve(relative).normalize();}
  static void send(HttpExchange ex,String body,String type,int status)throws IOException{byte[] data=body.getBytes(StandardCharsets.UTF_8);ex.getResponseHeaders().set("Content-Type",type+"; charset=utf-8");ex.sendResponseHeaders(status,data.length);ex.getResponseBody().write(data);ex.close();}
  static void serveStatic(HttpExchange ex,String path)throws IOException{String relative=path.equals("/")?"index.html":path.substring(1).replace('/',File.separatorChar);Path p=file(relative);if(!Files.isRegularFile(p)){send(ex,"No encontrado","text/plain",404);return;}String type=relative.endsWith(".html")?"text/html":relative.endsWith(".js")?"text/javascript":relative.endsWith(".css")?"text/css":relative.endsWith(".xml")?"application/xml":"application/octet-stream";send(ex,Files.readString(p),type,200);}
}
