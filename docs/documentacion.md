# Documentación esencial

## 1. Objetivo

NexoMarket representa una tienda en línea donde un comprador consulta productos y genera un pedido. XML es la fuente funcional de datos: la interfaz consulta `catalogo.xml`, el servidor valida los documentos con XSD, XSLT transforma el catálogo y los cambios del vendedor se persisten en XML.

## 2. Modelo de información

El archivo `catalogo.xml` contiene categorías y productos. Cada producto tiene identificador, categoría, nombre, descripción, precio, vendedor y stock. El archivo `pedidos.xml` registra al comprador, los artículos, cantidades, precios, total, fecha y estado.

## 3. Tecnologías XML

- XML: almacenamiento estructurado y portable de información.
- XSD: define elementos obligatorios, tipos de datos, atributos y cardinalidades.
- XSLT: transforma el catálogo XML en una tabla HTML.
- XPath: permite localizar productos, precios y existencias.
- XQuery: permite consultar y ordenar colecciones XML.

## 4. Usuarios y funcionamiento

El archivo `usuarios.xml` define tres roles: comprador, vendedor y administrador. El selector de la interfaz simula el acceso a cada rol sin contraseñas ni autenticación real.

El comprador puede filtrar productos, agregarlos al carrito y generar un pedido XML. El vendedor puede publicar, editar y eliminar productos; los cambios se conservan en el almacenamiento local del navegador. El administrador puede consultar un resumen del catálogo, usuarios y pedidos.

## 5. Funcionamiento técnico

El navegador solicita el catálogo mediante `/api/catalogo`. El servidor lee `catalogo.xml`, lo valida contra `catalogo.xsd` y lo devuelve a JavaScript, que lo convierte en tarjetas HTML. El endpoint `/api/catalogo-html` demuestra la transformación directa mediante `catalogo.xsl`.

El comprador agrega productos al carrito. Al finalizar, JavaScript construye un pedido XML y lo envía a `/api/pedidos`; el servidor lo valida contra `pedidos.xsd` y lo agrega a `data/pedidos.xml`. El vendedor envía altas, cambios y bajas a `/api/productos`; cada operación modifica `catalogo.xml` y vuelve a validarlo. `usuarios.xml` se consulta y valida mediante `/api/usuarios`.

## 6. Alcance y limitaciones

Es una demostración académica. No incluye pagos reales, usuarios reales, inventario conectado a un servidor ni envío de productos. La administración de vendedores queda prevista para una segunda etapa.

## 7. Conclusión

El proyecto demuestra cómo XML puede funcionar como fuente estructurada de datos y cómo XSD, XSLT, XPath y XQuery complementan su validación, transformación y consulta.
