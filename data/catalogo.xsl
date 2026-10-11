<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" />
    <xsl:template match="/"><html>
            <body>
                <h1>Catálogo NexoMarket</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Vendedor</th>
                        <th>Stock</th>
                    </tr>
                    <xsl:for-each select="catalogo/productos/producto"><tr>
                            <td>
                                <xsl:value-of select="@id" />
                            </td>
                            <td>
                                <xsl:value-of select="nombre" />
                            </td>
                            <td>
                                <xsl:value-of select="precio" />
                                <xsl:value-of select="precio/@moneda" />
                            </td>
                            <td>
                                <xsl:value-of select="vendedor" />
                            </td>
                            <td>
                                <xsl:value-of select="stock" />
                            </td>
                        </tr></xsl:for-each>
                </table>
            </body>
        </html></xsl:template>
</xsl:stylesheet>