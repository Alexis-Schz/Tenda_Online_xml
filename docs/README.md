# NexoMarket

Proyecto académico de una tienda en línea tipo marketplace, desarrollado para practicar XML, XSD, XSLT, XPath y XQuery.

## Ejecución

Ejecutar `iniciar-proyecto.ps1` desde PowerShell y abrir `http://localhost:8080`. Ahora el servidor lee y valida los XML, aplica XSLT, actualiza el catálogo y guarda los pedidos en `data/pedidos.xml`. Abrir `index.html` directamente solo conserva un modo de demostración sin conexión al servidor.

## Estructura

- `index.html`: interfaz principal.
- `css/styles.css`: identidad visual y diseño responsive.
- `js/app.js`: búsqueda, filtros, carrito y pedido simulado.
- `server.ps1`: servidor local y API XML para lectura, validación y persistencia.
- `XmlServer.java`: servidor HTTP que integra DOM, validación XSD y transformación XSLT.
- `data/catalogo.xml`: catálogo estructurado.
- `data/catalogo.xsd`: reglas de validación del catálogo.
- `data/catalogo.xsl`: transformación XSLT del catálogo a una tabla HTML.
- `data/pedidos.xml`: ejemplo de pedido.
- `data/pedidos.xsd`: reglas de validación de pedidos.
- `data/usuarios.xml`: usuarios de demostración: comprador, vendedor y administrador.
- `data/usuarios.xsd`: reglas de validación de usuarios.
- `docs/documentacion.md`: explicación académica esencial.
- `docs/consultas.md`: ejemplos de XPath y XQuery.

## Roles

El selector de usuario permite revisar tres roles académicos:

- Comprador: consulta productos, usa el carrito y genera pedidos XML.
- Vendedor: publica productos y puede editar o eliminar productos desde su panel.
- Administrador: consulta un resumen de productos, usuarios y pedidos locales.

## Flujo XML funcional

1. El navegador solicita `catalogo.xml` al servidor.
2. El servidor valida el documento con `catalogo.xsd`.
3. JavaScript convierte los nodos XML en tarjetas de producto.
4. XSLT transforma el mismo catálogo en una tabla HTML en `/api/catalogo-html`.
5. Los cambios del vendedor se escriben en `catalogo.xml` y se vuelven a validar.
6. Los pedidos se reciben como XML, se validan con `pedidos.xsd` y se guardan en `data/pedidos.xml`.

## Validación

Abrir `data/catalogo.xml` y `data/pedidos.xml` en un validador XML/XSD para comprobar su estructura.
