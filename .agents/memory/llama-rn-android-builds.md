---
name: Android builds with llama.rn
description: Constraint for completing EAS Android builds when llama.rn is used in an Expo project.
---

For the internal Android APK, restrict the Gradle build to `arm64-v8a` and the generic `rnllama` JNI variant.

**Why:** The default configuration creates multiple CPU-specialized JNI wrapper variants. On the EAS builder this exceeded the remote build time limit, while the generic arm64 variant completed and retained CPU inference support for current Android phones.

**How to apply:** Keep the restrictions in the internal/preview build profile. If emulator or 32-bit-device support is required later, plan a separate compatibility build and allow additional architectures or variants deliberately.