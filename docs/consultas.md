# Consultas XML de referencia

## XPath

```xpath
catalogo/productos/producto
catalogo/productos/producto[precio > 800]
catalogo/productos/producto[@categoria = 'tecnologia']
catalogo/productos/producto[stock = 0]
catalogo/productos/producto/nombre
```

## XQuery

```xquery
for $producto in doc("catalogo.xml")/catalogo/productos/producto
where xs:decimal($producto/precio) > 800
order by xs:decimal($producto/precio) descending
return <producto id="{$producto/@id}">
  <nombre>{$producto/nombre/text()}</nombre>
  <precio>{$producto/precio/text()}</precio>
</producto>
```

```xquery
for $categoria in distinct-values(doc("catalogo.xml")/catalogo/productos/producto/@categoria)
return <categoria id="{$categoria}" cantidad="{count(doc("catalogo.xml")/catalogo/productos/producto[@categoria=$categoria])}"/>
```
