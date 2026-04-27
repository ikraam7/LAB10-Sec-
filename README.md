# Frida Android Instrumentation Lab

## Présentation

Ce laboratoire porte sur l’installation, le déploiement et la validation de **Frida** dans un environnement Android.

Frida est un outil d’instrumentation dynamique permettant d’injecter des scripts JavaScript dans une application en cours d’exécution. Il est utilisé en sécurité mobile pour observer le comportement réel d’une application, inspecter les appels Java, intercepter des fonctions natives et analyser les interactions avec le système.

Le lab a été réalisé sur un émulateur Android dans un cadre pédagogique.

**Application cible :** `com.example.app`

---

## Objectifs du lab

Les objectifs de ce laboratoire sont :

- installer et vérifier Frida côté ordinateur ;
- déployer `frida-server` sur un émulateur Android ;
- vérifier la communication entre le PC et l’appareil Android ;
- injecter un script JavaScript minimal ;
- explorer le processus cible avec la console interactive Frida ;
- tester des hooks natifs sur des fonctions réseau ;
- tester des hooks Java sur le stockage local, SQLite, Debug et Runtime ;
- diagnostiquer les erreurs courantes ;
- nettoyer l’environnement après les tests.

---

## Environnement utilisé

| Élément | Valeur |
|---|---|
| Système hôte | Windows |
| Terminal | PowerShell |
| Outil Android | Android SDK Platform Tools / ADB |
| Appareil cible | Android Emulator 5554 |
| Architecture Android | `x86_64` |
| Version Frida | `17.9.1` |
| Application cible | `com.example.app` |
| Dossier de travail | `C:\Lab_Frida` |

---

# 1. Installation du client Frida

La première étape consiste à installer Frida côté ordinateur.  
Le client Frida contient la bibliothèque Python `frida` ainsi que les outils CLI comme `frida`, `frida-ps` et `frida-trace`.

Commande d’installation :

<img width="796" height="98" alt="2" src="https://github.com/user-attachments/assets/77a9981d-0a6a-428b-90dc-ce4d154ae753" />

Vérification de la version :

```powershell
frida --version
python -c "import frida; print(frida.__version__)"
```

Dans ce lab, la version utilisée est :

```text
17.9.1
```

Cette version est importante, car le client Frida et `frida-server` doivent être compatibles.

---

# 2. Vérification des outils Android

L’outil `adb` permet de communiquer avec l’émulateur Android.

Commande utilisée :

```powershell
.\adb.exe devices
```

L’émulateur utilisé pendant le lab est :

```text
emulator-5554
```

Cette étape permet de vérifier que l’appareil Android est bien détecté avant de déployer `frida-server`.

---

# 3. Identification de l’architecture Android

Avant de télécharger `frida-server`, il faut identifier l’architecture CPU de l’émulateur Android.

Commande utilisée :

<img width="927" height="103" alt="4" src="https://github.com/user-attachments/assets/bdc4c2d3-975a-49d5-89bf-5baf6c276e7c" />


Résultat obtenu :

```text
x86_64
```

Cela signifie que la version correcte à utiliser est :

```text
frida-server-17.9.1-android-x86_64
```

---

# 4. Déploiement de frida-server sur Android

Après avoir téléchargé et décompressé la version compatible de `frida-server`, le binaire a été copié dans le répertoire `/data/local/tmp`.

Commande utilisée :

```powershell
.\adb.exe push C:\Lab_Frida\frida-server /data/local/tmp/frida-server
```

Cette commande permet de transférer le binaire Frida depuis le PC vers l’émulateur Android.

<img width="952" height="106" alt="5" src="https://github.com/user-attachments/assets/bad59f4d-d1eb-4706-8e08-c08615b94672" />

Ensuite, les permissions d’exécution ont été ajoutées :

```powershell
.\adb.exe shell chmod 755 /data/local/tmp/frida-server
```

Cette étape est nécessaire pour autoriser Android à exécuter le fichier.

<img width="931" height="75" alt="6" src="https://github.com/user-attachments/assets/549be368-0667-49f6-9d0b-61cd3f5d7533" />

---

# 5. Lancement de frida-server

Le serveur Frida a ensuite été lancé sur l’émulateur Android.

Commande utilisée :

```powershell
.\adb.exe shell "/data/local/tmp/frida-server -l 0.0.0.0 &"
```

Pour vérifier que le serveur est actif :

```powershell
.\adb.exe shell ps | findstr frida
```

Le résultat montre que le processus `frida-server` est bien en cours d’exécution.

<img width="945" height="81" alt="7" src="https://github.com/user-attachments/assets/7082dba8-4212-465d-85e5-765831cafa1a" />

---

# 6. Redirection des ports Frida

Frida utilise principalement les ports `27042` et `27043`.  
Ces ports ont été redirigés avec ADB afin de permettre la communication entre le PC et l’émulateur.

Commandes utilisées :

```powershell
.\adb.exe forward tcp:27042 tcp:27042
.\adb.exe forward tcp:27043 tcp:27043
.\adb.exe forward --list
```

Le résultat montre que les ports sont correctement redirigés.

<img width="978" height="236" alt="9" src="https://github.com/user-attachments/assets/bd3c00bd-adf4-4ec1-8206-494a108b05a1" />


---

# 7. Test de connexion depuis le PC

La connexion Frida a été testée avec :

```powershell
frida-ps -U
```

Cette commande permet de lister les processus actifs sur l’émulateur Android.

<img width="998" height="367" alt="10" src="https://github.com/user-attachments/assets/939a8fc7-ca96-47cf-b208-a9c4c4ac0ca7" />


Ensuite, la commande suivante a été utilisée pour lister les applications et leurs packages :

```powershell
frida-ps -Uai
```

Cette commande a permis d’identifier l’application cible :

```text
com.example.app
```

<img width="878" height="553" alt="11" src="https://github.com/user-attachments/assets/d9cdf16b-07f3-4bb3-a49e-87119431fc92" />


---

# 8. Injection d’un script Java minimal

Un premier script `hello.js` a été créé pour vérifier que Frida peut accéder au runtime Java de l’application.

Contenu du script :

```javascript
Java.perform(function () {
  console.log("[+] Frida Java.perform OK");
});
```

Commande d’injection :

```powershell
frida -U -f com.example.app -l C:\Lab_Frida\hello.js
```

Résultat obtenu :

```text
[+] Frida Java.perform OK
```

Ce résultat confirme que :

- Frida peut lancer l’application cible ;
- le script JavaScript est injecté correctement ;
- l’environnement Java de l’application est accessible.

<img width="998" height="433" alt="14" src="https://github.com/user-attachments/assets/1da75640-eac5-422b-a1cf-28775796db02" />



---

# 9. Injection d’un script natif minimal

Un deuxième test a été réalisé avec un script natif afin d’intercepter la fonction `recv`.

Cette fonction est liée à la réception de données réseau.

Exemple de script utilisé :

```javascript
console.log("[+] Script chargé");

const recvPtr = Process.getModuleByName("libc.so").getExportByName("recv");

console.log("[+] recv trouvée à : " + recvPtr);

Interceptor.attach(recvPtr, {
  onEnter(args) {
    console.log("[+] recv appelée");
  }
});
```

Ce test confirme que Frida peut localiser une fonction native dans `libc.so` et installer un hook dessus.

<img width="997" height="430" alt="13" src="https://github.com/user-attachments/assets/e5666bf8-6b49-4ec9-86b6-36ee349cbb51" />


---

# 10. Exploration de la console interactive Frida

Après l’injection, la console interactive Frida a été utilisée pour inspecter le processus cible.

Commandes utilisées :

```javascript
Process.arch
Process.platform
Process.id
Process.mainModule
Process.getModuleByName("libc.so")
Process.getModuleByName("libc.so").getExportByName("recv")
```

Résultats observés :

- architecture du processus : `x64` ;
- plateforme : `linux` ;
- module principal : `/system/bin/app_process64` ;
- bibliothèque native inspectée : `libc.so` ;
- fonction native localisée : `recv`.

Cette étape montre que Frida permet d’observer des informations internes du processus Android.

<img width="972" height="622" alt="15" src="https://github.com/user-attachments/assets/2f9f170d-4efe-40a3-a7e3-473ddbe7a8cf" />


---

# 11. Vérification de l’environnement Java

La commande suivante a été exécutée dans la console Frida :

```javascript
Java.available
```

Résultat obtenu :

```text
true
```

Cela confirme que Frida peut interagir avec les classes Java de l’application.

<img width="772" height="95" alt="16 1" src="https://github.com/user-attachments/assets/a256b41f-17ad-4fc7-ba06-20fa01bd7caf" />

---

# 12. Détection des bibliothèques de chiffrement

Les bibliothèques liées au chiffrement et aux communications sécurisées ont été recherchées avec la commande suivante :

```javascript
Process.enumerateModules().filter(m =>
  m.name.indexOf("ssl") !== -1 ||
  m.name.indexOf("crypto") !== -1 ||
  m.name.indexOf("boring") !== -1
)
```

Bibliothèques observées :

- `libcrypto.so`
- `libjavacrypto.so`
- `libssl.so`

Ces bibliothèques indiquent que le processus charge des composants liés à la cryptographie ou aux communications sécurisées.




---

# 13. Hook de la fonction connect

La fonction native `connect` est utilisée lorsqu’une application établit une connexion réseau.

Un script `hook_connect.js` a été utilisé pour l’intercepter.

Commande utilisée :

```powershell
frida -U -f com.example.app -l C:\Lab_Frida\hook_connect.js
```

Résultat observé :

```text
[+] Hook connect chargé
[+] connect trouvée à : ...
```

Cela confirme que la fonction `connect` a été localisée et que le hook a été installé.




---

# 14. Hook des fonctions send et recv

Les fonctions natives `send` et `recv` sont utilisées pour envoyer et recevoir des données réseau.

Un script `hook_network.js` a été utilisé pour installer des hooks sur ces fonctions.

Commande utilisée :

```powershell
frida -U -f com.example.app -l C:\Lab_Frida\hook_network.js
```

Résultat observé :

```text
[+] Hooks réseau chargés
[+] send trouvée à : ...
[+] recv trouvée à : ...
```

Ce résultat confirme que les fonctions réseau natives ont été localisées et que les hooks ont été chargés correctement.



---

# 15. Observation des accès au stockage local

Des hooks Java ont été utilisés pour observer les accès aux `SharedPreferences`.

Les `SharedPreferences` sont souvent utilisées pour stocker des paramètres, des préférences utilisateur ou des états internes.

Script testé :

```text
hook_prefs.js
```

Objectif :

- observer les lectures dans `SharedPreferences`.

<img width="995" height="395" alt="20" src="https://github.com/user-attachments/assets/9c37e1c7-2665-4884-b41f-f09c9b71167f" />


Un deuxième script a été utilisé pour observer les écritures :

```text
hook_prefs_write.js
```

Objectif :

- observer les appels à `putString()` ou `putBoolean()`.

<img width="978" height="397" alt="24" src="https://github.com/user-attachments/assets/f3f179c3-955d-423a-85b1-1732869e4439" />


---

# 16. Observation des requêtes SQLite

SQLite est utilisé par de nombreuses applications Android pour stocker des données locales.

Un script `hook_sqlite.js` a été testé afin d’observer les requêtes exécutées par l’application.

Objectif :

- observer les appels à `execSQL()` ;
- observer les appels à `rawQuery()`.

Le hook a été chargé correctement. Aucun événement SQL détaillé n’a été déclenché pendant ce test.

<img width="997" height="365" alt="21" src="https://github.com/user-attachments/assets/354a7725-7ac5-4421-959b-58294eba36bc" />



---

# 17. Observation des vérifications de debug

Certaines applications vérifient si un débogueur est attaché au processus.

Un script `hook_debug.js` a été utilisé pour observer les appels liés à `android.os.Debug`.

Objectif :

- observer `isDebuggerConnected()` ;
- observer `waitingForDebugger()`.

Le hook a été chargé correctement.

<img width="987" height="387" alt="22" src="https://github.com/user-attachments/assets/f61acced-210d-4132-832a-e33cef04ce3f" />


---

# 18. Observation de Runtime.exec

Certaines applications exécutent des commandes système via `Runtime.exec()`.

Un script `hook_runtime.js` a été utilisé pour observer ces appels.

Objectif :

- détecter les commandes exécutées par l’application ;
- repérer d’éventuelles vérifications de l’environnement ;
- observer des comportements liés à la détection root ou debug.

Le hook a été chargé correctement.

<img width="988" height="383" alt="23" src="https://github.com/user-attachments/assets/d673a9a2-6aea-4b93-b448-a4131ccb3088" />


---

# 19. Dépannage

## Erreur : need Gadget to attach on jailed Android

Cette erreur est apparue lorsque Frida ne pouvait pas utiliser correctement `frida-server`.

Solution appliquée :

- vérifier que `frida-server` est bien copié dans `/data/local/tmp` ;
- appliquer les permissions avec `chmod 755` ;
- lancer `frida-server` ;
- rediriger les ports `27042` et `27043` ;
- vérifier que les versions client et serveur sont compatibles.

---

## Erreur : Address already in use

Cette erreur signifie que `frida-server` était déjà lancé et utilisait déjà le port `27042`.

Solution :

```powershell
.\adb.exe shell ps | findstr frida
```

Si nécessaire :

```powershell
.\adb.exe shell pkill -f frida-server
```

---

## Erreur : unable to find process with name

Cette erreur était liée à l’utilisation d’un mauvais nom de package ou à une application non lancée.

Solution :

```powershell
frida-ps -Uai
```

Cette commande permet d’identifier le vrai package de l’application cible.

---

# 20. Nettoyage

À la fin du lab, `frida-server` a été arrêté :

```powershell
.\adb.exe shell pkill -f frida-server
```

Puis le processus a été vérifié :

```powershell
.\adb.exe shell ps | findstr frida
```

<img width="998" height="75" alt="26" src="https://github.com/user-attachments/assets/b05400ed-6dfe-4cc2-9b18-b99cc75b28fb" />


Le binaire a ensuite été supprimé de l’émulateur :

```powershell
.\adb.exe shell rm /data/local/tmp/frida-server
```

<img width="991" height="115" alt="27" src="https://github.com/user-attachments/assets/15db3c51-db40-400d-8c6c-f5ef43126afe" />


---

# 21. Résultats obtenus

À la fin du laboratoire :

- Frida est installé et fonctionnel sur Windows.
- L’émulateur Android est détecté avec ADB.
- L’architecture Android `x86_64` a été identifiée.
- `frida-server` a été déployé et lancé correctement.
- Les ports Frida ont été redirigés.
- La connexion Frida a été validée avec `frida-ps`.
- L’application cible `com.example.app` a été identifiée.
- Le script `hello.js` a été injecté avec succès.
- Le runtime Java est accessible.
- Le processus cible a été exploré avec la console Frida.
- Les bibliothèques natives et cryptographiques ont été observées.
- Les fonctions réseau `connect`, `send` et `recv` ont été localisées.
- Des hooks Java ont été testés sur SharedPreferences, SQLite, Debug et Runtime.

---

# 22. Conclusion

Ce laboratoire a permis de mettre en place un environnement complet d’instrumentation dynamique Android avec Frida.

L’installation du client Frida, le déploiement de `frida-server`, la redirection des ports et l’injection de scripts ont été réalisés avec succès.

Les tests effectués montrent que Frida peut être utilisé pour :

- analyser dynamiquement une application Android ;
- interagir avec l’environnement Java ;
- inspecter des bibliothèques natives ;
- localiser des fonctions sensibles ;
- installer des hooks Java et natifs.

Ce lab constitue une base solide pour des analyses dynamiques plus avancées sur Android.

---

## 👩‍💻 Auteure

**Ikram Laabouki**  
ENSA Marrakech  
Module : Cybersécurité Mobile
