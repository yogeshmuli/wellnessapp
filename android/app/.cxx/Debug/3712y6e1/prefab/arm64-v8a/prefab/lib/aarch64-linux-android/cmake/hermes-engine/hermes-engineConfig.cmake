if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/yogeshmuli/.gradle/caches/8.13/transforms/6e98cd0ac088266749877810f8f426fa/transformed/hermes-android-0.79.2-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/yogeshmuli/.gradle/caches/8.13/transforms/6e98cd0ac088266749877810f8f426fa/transformed/hermes-android-0.79.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

