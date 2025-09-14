import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Text from "../text";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import { Typography, Spacing } from "../../styles";
import { BottomSheetModal } from "../modals";
import { text } from "stream/consumers";
import { useTheme } from "../../hooks/useTheme";

const Pill = ({
  label,
  onRemove,
  isAddMore,
  onPress,
  colorKey,
  disableEditing = false,
}) => {
  const { Colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={isAddMore ? onPress : onRemove}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isAddMore
          ? Colors.lightBodyBackground
          : Colors[colorKey],
        borderRadius: 4,
        paddingHorizontal: 6,
        width: "auto",
        marginRight: 8,
        marginBottom: 8,
        height: "auto",
      }}
    >
      <Text
        style={{
          color: isAddMore ? Colors.text : Colors.white,
          fontWeight: "500",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      {!isAddMore && !disableEditing && (
        <Text
          style={{
            color: Colors.white,
            fontWeight: "bold",
          }}
        >
          ×
        </Text>
      )}
    </TouchableOpacity>
  );
};

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
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { Colors } = useTheme();

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
    <View style={{ marginBottom: 16, width: "100%" }}>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 18,
          color: Colors.text,

          ...labelStyle,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: Colors.lightBodyBackground,
          padding: 12,
          borderRadius: 8,
        }}
      >
        {selected &&
          selected.map((item) => (
            <Pill
              key={item.value}
              label={item.label}
              colorKey={item.colorKey}
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
              backgroundColor: Colors.bodyBackground,
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
                  color: Colors.text,
                  marginBottom: Spacing.small,
                }}
              >
                {`Select ${label}`}
              </Text>
              {/* close icon */}
              <TouchableOpacity onPress={() => setShowInput(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
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
                  colorKey={item.colorKey}
                  disableEditing={disableEditing}
                  onRemove={() => handleRemove(item)}
                />
              ))}
            </View>

            {/* Search Input */}
            <TextInput
              style={{
                height: 50,
                borderColor: Colors.lightBorder,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 10,
                backgroundColor: Colors.lightBodyBackground,
                fontFamily: Typography.fontFamily,
                color: Colors.text,
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
                backgroundColor: Colors.bodyBackground,
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
                      borderBottomColor: Colors.lightBorder,
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

export const SelectInput = ({ label, value, onChange, options, error }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { Colors } = useTheme();

  const handleSelect = (item) => {
    onChange(item);
    setShowOptions(false);
  };

  return (
    <View style={{ marginBottom: 16, width: "100%" }}>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 18,
          color: Colors.text,
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setShowOptions(true)}
        style={{
          height: 50,
          borderColor: Colors.lightBorder,
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 10,
          backgroundColor: Colors.lightBodyBackground,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: value ? Colors.text : Colors.lightText,
            fontFamily: Typography.fontFamily,
          }}
        >
          {value?.label || "Select an option"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showOptions} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.bodyBackground,
                maxHeight: "50%",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 20,
              }}
            >
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
                    color: Colors.text,
                    marginBottom: Spacing.small,
                  }}
                >
                  {`Select ${label}`}
                </Text>
                {/* close icon */}
                <TouchableOpacity onPress={() => setShowOptions(false)}>
                  <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option)}
                    style={{
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.lightBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSizeMedium,
                        color: Colors.text,
                        fontFamily: Typography.fontFamily,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  const { Colors } = useTheme();
  return (
    <View>
      {label && (
        <Text
          style={{
            marginBottom: 8,
            fontFamily: Typography.fontFamily,
            fontSize: 18,

            paddingLeft: -5,
          }}
        >
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
            borderColor: Colors.lightBorder,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: Colors.lightBodyBackground,
            fontFamily: Typography.fontFamily,
            fontSize: 18,
            color: Colors.text,
            ...style,
          }}
          placeholderTextColor={Colors.lightText}
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
  const { Colors } = useTheme();

  if (disableEditing) {
    // render normal input without editing
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
        <Text
          style={{
            fontSize: Typography.fontSizeMedium,
            color: Colors.text,
            paddingVertical: 4,
            ...textStyle,
          }}
        >
          {value || label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {label && <Text style={{ marginRight: 8 }}>{label}</Text>}
      {isEditing ? (
        <TextInput
          style={[
            {
              borderBottomWidth: 1,
              borderColor: Colors.primary,
              fontSize: Typography.fontSizeMedium,
              paddingVertical: 4,
              color: Colors.text,
              width: "auto",

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
          style={{
            fontSize: Typography.fontSizeMedium,
            color: Colors.text,
            paddingVertical: 4,
            width: "auto",
            ...textStyle,
          }}
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

export const CustomInput = ({
  value,
  onChangeText,
  label,
  suffix,
  placeholder = "",
  keyboardType = "default",
  secureTextEntry = false,
  disableEditing = false,
  style = {},
  textStyle = {},
  inputStyle = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = React.useRef();
  const { Colors } = useTheme();

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        ...style,
      }}
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        {label && (
          <Text style={{ marginRight: 8, color: Colors.lightText }}>
            {label}
          </Text>
        )}
        {isEditing && !disableEditing ? (
          <TextInput
            ref={ref}
            style={[
              {
                height: 40,

                borderRadius: 8,
                paddingHorizontal: 10,
                paddingBottom: 3,
                textAlignVertical: "center",

                fontFamily: Typography.fontFamily,
                fontSize: 18,
                lineHeight: 20,
                color: Colors.text,
                ...inputStyle,
              },
            ]}
            placeholderTextColor={Colors.lightText}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize="none"
            secureTextEntry={secureTextEntry}
          />
        ) : (
          <View
            style={{
              height: 40,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                borderRadius: 8,
                paddingHorizontal: 10,

                marginBottom: 0,
                paddingTop: 0,

                fontFamily: Typography.fontFamily,
                fontSize: 18,
                color: Colors.text,
              }}
            >
              {value || placeholder} {suffix && suffix}
            </Text>
          </View>
        )}
      </View>
      {/* Editing Icon */}
      {!disableEditing && (
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Octicons
            name={isEditing ? "check" : "pencil"}
            size={22}
            color={iconColor}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
