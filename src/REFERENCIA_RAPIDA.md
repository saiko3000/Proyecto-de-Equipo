# ⚡ Referencia Rápida - Tipos de Archivos

## 🎯 Pregunta Común

**"¿Puedo usar .tsx como JavaScript o HTML?"**

### 🔴 Respuesta: NO

- ❌ `.tsx` NO es JavaScript puro
- ❌ `.tsx` NO es HTML
- ✅ `.tsx` es TypeScript + JSX (necesita compilación)
- ✅ **Figma Make compila automáticamente** - No te preocupes

---

## 📁 Extensiones en Este Proyecto

| Extensión | Qué es | Navegador ejecuta | Necesita compilación |
|-----------|--------|-------------------|---------------------|
| `.tsx` | TypeScript + React | ❌ NO | ✅ Sí (automática) |
| `.ts` | TypeScript puro | ❌ NO | ✅ Sí (automática) |
| `.css` | Hojas de estilo | ✅ SÍ | ❌ No |

---

## 🔄 Proceso Automático

```
TÚ ESCRIBES          SISTEMA COMPILA         NAVEGADOR EJECUTA
    ↓                       ↓                        ↓
  .tsx                   .js                   JavaScript
  (TypeScript)      (Compilado)                  (Puro)
```

---

## ✅ Lo que debes hacer

1. **Escribir código en `.tsx`** - Para componentes React
2. **Escribir código en `.ts`** - Para utilidades sin JSX
3. **Escribir estilos en `.css`** - Para diseño visual
4. **Dejar que el sistema compile** - Automático en Figma Make

---

## ❌ Lo que NO debes intentar

1. Abrir archivos `.tsx` directamente en el navegador
2. Usar `<script src="App.tsx">` en HTML
3. Pensar que `.tsx` es lo mismo que `.js`

---

## 💡 Recuerda

**Este proyecto usa TypeScript/TSX:**
- Código más seguro (tipos)
- Mejor autocompletado
- Detecta errores antes
- **Se compila automáticamente a JavaScript**

**No necesitas:**
- ❌ Instalar compiladores
- ❌ Configurar nada
- ❌ Ejecutar comandos de build

**Solo necesitas:**
- ✅ Escribir tu código
- ✅ El sistema hace el resto

---

## 📚 Documentación Completa

- **TIPOS_DE_ARCHIVOS.md** - Explicación detallada de cada tipo
- **COMO_FUNCIONA.md** - Cómo funciona la compilación
- **Este archivo** - Referencia rápida

---

**¡Escribe con confianza!** ✨
