import Realm from 'realm';
import Keys from '../Config/constant/PrefKeys';


const PreferencesSchemaName = 'prefs';
const PreferencesSchema = {
  name: PreferencesSchemaName,
  properties: {
      key: 'string',
      value_string: {type: 'string', optional: true},
      value_int:    {type: 'int'   , optional: true},
      value_double: {type: 'double', optional: true},
      value_bool:   {type: 'bool'  , optional: true},
  }
};

const prefsRealmInstance = new Realm({
  path: 'prefs.realm',
  schema: [PreferencesSchema]
});

function getPrefsStringBy(key, default_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  return (record && record.value_string) ? record.value_string : default_value;
}

function setPrefsStringFor(key, with_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  prefsRealmInstance.write(()=>{
      if (record) {
          record.value_string = with_value;
      } else {
          prefsRealmInstance.create(PreferencesSchemaName, {
              key,
              value_string: with_value,
          });

      }
  });
}


function getPrefsIntBy(key, default_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  return (record && record.value_int) ? record.value_int : default_value;
}

function setPrefsIntFor(key, with_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  prefsRealmInstance.write(()=>{
      if (record) {
          record.value_int = with_value;
      } else {
          prefsRealmInstance.create(PreferencesSchemaName, {
              key,
              value_int: with_value,
          });

      }
  });
}

function getPrefsDoubleBy(key, default_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  return (record && record.value_double) ? record.value_double : default_value;
}

function setPrefsDoubleFor(key, with_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  prefsRealmInstance.write(()=>{
      if (record) {
          record.value_double = with_value;
      } else {
          prefsRealmInstance.create(PreferencesSchemaName, {
              key,
              value_int: with_value,
          });

      }
  });
}

function getPrefsBoolBy(key, default_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  return (record && record.value_bool) ? record.value_bool : default_value;
}

function setPrefsBoolFor(key, with_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  prefsRealmInstance.write(()=>{
      if (record) {
          record.value_bool = with_value;
      } else {
          prefsRealmInstance.create(PreferencesSchemaName, {
              key,
              value_bool: with_value,
          });

      }
  });
}

function setPrefsObjectFor(key, with_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  prefsRealmInstance.write(()=>{
      if (record) {
          record.value_string = JSON.stringify(with_value);
      } else {
          prefsRealmInstance.create(PreferencesSchemaName, {
              key,
              value_string: JSON.stringify(with_value),
          });

      }
  });
}


function getPrefsObjectBy(key, default_value) {
  const queries = prefsRealmInstance.objects(PreferencesSchemaName)
      .filtered(`key = "${key}"`);
  const record = queries[0];
  return (record && record.value_string) ? JSON.parse(record.value_string) : default_value;
}


export const Preferences = {
  getPrefsStringBy,
  setPrefsStringFor,
  getPrefsIntBy,
  setPrefsIntFor,
  getPrefsDoubleBy,
  setPrefsDoubleFor,
  getPrefsBoolBy,
  setPrefsBoolFor,
  setPrefsObjectFor,
  getPrefsObjectBy
};

export const PrefKeys = Keys;




