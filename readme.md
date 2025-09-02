hours spend = 4 * 8 = 32 personhrs - till 18/07/2025
splash screen = 4 hrs



issues 
for duplicate class X found in modules Y.jar (Y) and Z.jar (Z), you can resolve this by excluding the duplicate dependency in your build.gradle file(android/level).

subprojects {
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.9.0'
            exclude group: 'com.android.support'
        }
    }
}