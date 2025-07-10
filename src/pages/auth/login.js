import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {login} from '../../redux/thunks/auth';
import LoadingOverlay from '../../components/loadingOverlay';

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'password@123',
  });

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleLogin = async () => {
    const {username, password} = formData;
    if (username && password) {
      setLoading(true);
      try {
        await dispatch(login({username, password})).unwrap();
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LoadingOverlay visible={loading} />
      <View style={styles.formContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={{height: 150}}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={formData.username}
          onChangeText={value => handleChange('username', value)}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={formData.password}
          onChangeText={value => handleChange('password', value)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fafbfc',
    fontSize: 16,
    color: '#222',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#1976d2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
