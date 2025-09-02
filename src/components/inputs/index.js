import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Colors, Typography, Spacing } from "../../styles";
import { BottomSheetModal } from "../modals";

const Pill = ({
  label,
  onRemove,
  isAddMore,
  onPress,
  disableEditing = false,
}) => (
  <TouchableOpacity
    onPress={isAddMore ? onPress : onRemove}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isAddMore ? Colors.lightGray : Colors.primary,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    }}
  >
    <Text
      style={{
        color: isAddMore ? Colors.text : Colors.white,
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
    {!isAddMore && !disableEditing && (
      <Text style={{ color: Colors.white, marginLeft: 6, fontWeight: "bold" }}>
        ×
      </Text>
    )}
  </TouchableOpacity>
);

export const MultiSelectInput = ({
  label,
  labelStyle,
  selected = [],
  onChange,
  placeholder = "Add item...",
  options = [],
  error,
  disableEditing = false,
}) => {
  console.log("CustomEditableInput rendered with value:");
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAdd = (item) => {
    if (item && !selected.includes(item)) {
      onChange([...selected, item]);
    }
    setInput("");
    // setShowInput(false);
  };

  const handleRemove = (item) => {
    onChange(selected.filter((i) => i !== item));
  };

  // Filter options to exclude already selected and match input
  const filteredOptions = options.filter(
    (opt) =>
      !selected.some((sel) => sel.value === opt.value) &&
      (!input || opt.label?.toLowerCase().includes(input.toLowerCase()))
  );

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[{ marginBottom: 8 }, labelStyle]}>{label}</Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {selected &&
          selected.map((item) => (
            <Pill
              key={item.value}
              label={item.label}
              disableEditing={disableEditing}
              onRemove={() => handleRemove(item)}
            />
          ))}
        {!disableEditing && (
          <Pill
            key={"add-more"}
            label={showInput ? "" : "+ Add more"}
            isAddMore
            onPress={() => setShowInput(true)}
          />
        )}
      </View>

      {
        <BottomSheetModal
          visible={showInput}
          onClose={() => setShowInput(false)}
        >
          {/* Modal Content */}

          <View
            style={{
              backgroundColor: Colors.body,
              padding: 20,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              height: 400,
              // use box shadow for better visibility
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSizeLarge,
                  fontFamily: Typography.fontFamilyBold,
                  color: Colors.textPrimary,
                  marginBottom: Spacing.small,
                }}
              >
                {`Select ${label}`}
              </Text>
              {/* close icon */}
              <TouchableOpacity onPress={() => setShowInput(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Selected Pills */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginVertical: Spacing.small,
              }}
            >
              {selected.map((item) => (
                <Pill
                  key={item.value}
                  label={item.label}
                  disableEditing={disableEditing}
                  onRemove={() => handleRemove(item)}
                />
              ))}
            </View>

            {/* Search Input */}
            <TextInput
              style={{
                height: 50,
                borderColor: Colors.lightGray,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 10,
                backgroundColor: Colors.white,
                fontFamily: Typography.fontFamily,
              }}
              value={input}
              onChangeText={setInput}
              placeholder={placeholder}
            />
            {/* Filtered Options */}
            <ScrollView
              style={{
                marginTop: 8,
                minHeight: 150,
                borderRadius: 8,
                backgroundColor: Colors.body,
              }}
              keyboardShouldPersistTaps="always"
            >
              {filteredOptions.length > 0 &&
                filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option?.value}
                    onPress={() => handleAdd(option)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.lightGray,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.text,
                        fontFamily: Typography.fontFamily,
                        fontSize: Typography.fontSizeMedium,
                      }}
                    >
                      {option?.label || option?.value}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Add Custom Option */}
            {input.trim() &&
              !options.find((o) => o.value === input.trim()) &&
              !selected.find((s) => s.value === input.trim()) && (
                <TouchableOpacity
                  onPress={() =>
                    handleAdd({
                      label: input.trim(),
                      value: input.trim(),
                    })
                  }
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: Colors.white }}>
                    Add "{input.trim()}"
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </BottomSheetModal>
      }

      {error ? (
        <Text style={{ color: Colors.error, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
};

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  leftIcon,
  containerStyle = {},
  style = {},
  secureTextEntry = false,
  keyboardType = "default",
  ...rest
}) => {
  return (
    <View>
      {label && (
        <Text style={{ marginBottom: 8, fontFamily: Typography.fontFamily }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          ...containerStyle,
        }}
      >
        {leftIcon && <View style={{ marginHorizontal: 10 }}>{leftIcon}</View>}

        <TextInput
          style={{
            flex: 1,
            height: 50,
            borderColor: Colors.lightGray,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 10,
            backgroundColor: Colors.white,
            fontFamily: Typography.fontFamily,
            ...style,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          {...rest}
        />
      </View>

      {error ? (
        <Text
          style={{
            color: Colors.error,
            marginTop: 4,
            fontFamily: Typography.fontFamily,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export const CustomEditableInput = ({
  value,
  onChangeText,
  label,
  placeholder = "",
  style = {},
  textStyle = {},
  inputStyle = {},
  iconColor = Colors.primary,
  disableEditing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (disableEditing) {
    // render normal input without editing
    return (
      <Text
        style={[
          {
            fontSize: Typography.fontSizeMedium,
            color: Colors.text,
            paddingVertical: 4,
          },
          textStyle,
        ]}
      >
        {value || label}
      </Text>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

          // width: "",
        },
        style,
      ]}
    >
      {isEditing ? (
        <TextInput
          style={[
            {
              borderBottomWidth: 1,
              borderColor: Colors.primary,
              fontSize: Typography.fontSizeMedium,
              paddingVertical: 4,
              color: Colors.text,

              justifyContent: "center",
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoFocus
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <Text
          style={[
            {
              fontSize: Typography.fontSizeMedium,
              color: Colors.text,
              paddingVertical: 4,
            },
            textStyle,
          ]}
        >
          {value || label}
        </Text>
      )}
      <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
        <Ionicons
          name={isEditing ? "checkmark-outline" : "create-outline"}
          size={22}
          color={iconColor}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Input;
