// Script Frida pour Android : hook des méthodes d'écriture dans SharedPreferences
// Ce script intercepte les appels à putString et putBoolean dans EditorImpl
// et log les clés et valeurs écrites dans les SharedPreferences

Java.perform(function () {
  console.log("[+] Hook écriture SharedPreferences chargé");

  // Obtenir une référence à la classe interne EditorImpl de SharedPreferencesImpl
  var EditorImpl = Java.use("android.app.SharedPreferencesImpl$EditorImpl");

  // Hook de la méthode putString pour les valeurs String
  EditorImpl.putString.overload("java.lang.String", "java.lang.String").implementation = function (key, value) {
    console.log("[SharedPreferences][putString] key=" + key + " value=" + value);  // Log clé et valeur
    return this.putString(key, value);  // Appeler la méthode originale
  };

  // Hook de la méthode putBoolean pour les valeurs boolean
  EditorImpl.putBoolean.overload("java.lang.String", "boolean").implementation = function (key, value) {
    console.log("[SharedPreferences][putBoolean] key=" + key + " value=" + value);  // Log clé et valeur
    return this.putBoolean(key, value);  // Appeler la méthode originale
  };
});