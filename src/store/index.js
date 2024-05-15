import { createContext, useContext, useMemo, useReducer } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';

const MyContext = createContext();
MyContext.displayName = 'Lab 3';

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, userLogin: action.value };
    case 'LOG_OUT':
      return { ...state, userLogin: null };
    case 'SET_SERVICES':
      return { ...state, services: action.value };
    case 'SET_SERVICE_DATA':
      return { ...state, serviceData: action.value };
    case 'RESET_SERVICE_DATA':
      return { ...state, serviceData: null };
    case 'UPDATE_SERVICE':
      return { ...state, updateService: true };
    case 'RESET_UPDATE_SERVICE':
      return { ...state, updateService: false };
    default:
      return new Error('Action not found');
  }
};

function MyContextControllerProvider({ children }) {
  const initialState = {
    userLogin: null,
    services: [],
    serviceData: null,
    updateService: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      'useMyContextController should be use inside the MyContextControllerProvider.',
    );
  }
  return context;
}

const USERS = firestore().collection('Users');
const SERVICES = firestore().collection('Services');

const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() =>
      USERS.doc(email).onSnapshot(u =>
        dispatch({ type: 'USER_LOGIN', value: u.data() }),
      ),
    )
    .catch(e => Alert.alert('sai email va password'));
};

const logout = dispatch => {
  auth()
    .signOut()
    .then(() => dispatch({ type: 'LOG_OUT' }));
};

const registerAccount = (userData) => {
  USERS.doc(userData.email).onSnapshot(u => {
    if (!u.exists) {
      auth()
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then(() =>
          USERS.doc(userData.email)
            .set(userData)
            .then(() => console.log('Add new customer!')),
        );
    }
  });
}

const createNewService = (newService, imagePath) => {
  newService.finalUpdate = firestore.FieldValue.serverTimestamp();
  SERVICES.add(newService)
    .then(response => {
      const ref = storage().ref("/services/" + response.id + ".png")
      ref.putFile(imagePath).then(() => {
        ref.getDownloadURL().then(link => {
          console.log(link)
          SERVICES.doc(response.id).update({ id: response.id, image: link })
        }
        )
      })
      Alert.alert("Add new service success")
    })
    .catch(e => Alert.alert("Add new service fail"))
};

const getServiceList = (dispatch) => {
  SERVICES
    .orderBy('finalUpdate', 'desc')
    .get()
    .then((querySnapshot) => {
      const servicesData = [];
      querySnapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() });
      });
      dispatch({ type: 'SET_SERVICES', value: servicesData });
    })
    .catch((error) => {
      console.error('Error getting services: ', error);
    });
};

const getServiceData = (dispatch, data) => {
  USERS.doc(data.userId).get()
    .then((userDoc) => {
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      const userData = { id: userDoc.id, name: userDoc.data().fullName };

      const combinedData = { ...data, userName: userData.name };

      dispatch({ type: 'SET_SERVICE_DATA', value: combinedData });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const deleteServiceData = (id) => {
  SERVICES.doc(id)
    .update({status: 'inactive'})
    .then(() => {
      Alert.alert("Xóa dịch vụ thành công");
    });
}

const restoreServiceData = (id) => {
  SERVICES.doc(id)
    .update({ status: 'active' })
    .then(() => {
      Alert.alert("Khôi phục dịch vụ thành công");
    });
}

const updateServiceData = async (id, newService, imagePath) => {
  try {
    newService.finalUpdate = firestore.FieldValue.serverTimestamp();

    await SERVICES.doc(id).update(newService);

    if (imagePath) {
      const ref = storage().ref(`/services/${id}.png`);
      await ref.putFile(imagePath);

      const downloadURL = await ref.getDownloadURL();

      await firestore().collection('Services').doc(id).update({id: id, image: downloadURL });
    }
    Alert.alert("Update service success");
  } catch (error) {
    console.log("Error updating service:", error.message);
  }
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  createNewService,
  registerAccount,
  getServiceList,
  getServiceData,
  deleteServiceData,
  updateServiceData,
  restoreServiceData,
};
