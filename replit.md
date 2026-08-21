# Plutxus

## Ejecutar en Replit

El flujo **Start Expo** ejecuta `yarn start` y arranca Metro para desarrollo de la app nativa.

## Generar un APK de prueba

1. Configura `EXPO_TOKEN` como secreto de Replit.
2. Ejecuta `npx eas-cli build --platform android --profile preview --non-interactive`.

El perfil `preview` produce un APK para distribución interna con arquitectura `arm64-v8a` y el motor de IA en CPU. Es compatible con teléfonos Android actuales de 64 bits; no está pensado para emuladores x86 ni dispositivos Android de 32 bits. El proyecto usa Yarn y `yarn.lock`; instala las dependencias con `yarn install --frozen-lockfile`.

## Validar

- `yarn tsc --noEmit`
- `npx expo-doctor`