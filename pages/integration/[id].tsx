import { useRouter } from "next/router";
import { getAPIClient } from "../../utils/client";
import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  type IntegrationDetail,
  IntegrationType,
  Contact,
  ContactFields,
} from "../../database/tables";
import styles from "../../styles/Integration.module.css";
import { type IntegrationDetails } from "../../utils/types";

const client = getAPIClient();

const handleSubmit = (
  event: FormEvent,
  id: string,
  details: { [key: string]: string | number }
) => {
  event.preventDefault();
  return client.createIntegration(id, details);
};

const kebabify = (name: string) =>
  name.toLowerCase().replaceAll(/[\_\s]/g, "-");

type FieldProps<T extends any> = {
  field: IntegrationDetail;
  value: T;
  setValue: (val: T) => void;
};

const StringField = <T extends any>({
  field,
  value,
  setValue,
}: FieldProps<T>) => (
  <div className={styles.field} key={field.id}>
    <label htmlFor={kebabify(field.name)}>{field.display}</label>
    <input
      onChange={(event) => setValue(event.target.value as T)}
      value={value as string | number | string[]}
      id={kebabify(field.name)}
    />
  </div>
);

const ExistingFieldMappings = ({
  currentFields,
  mappedFields,
  setMappedFields,
}: {
  currentFields: string[];
  mappedFields: { [key: string]: string };
  setMappedFields: (val: any) => void;
}) => (
  <table>
    <thead>
      <tr>
        <th>Field</th>
        <th>Mapped Field</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {currentFields.map((key) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{mappedFields[key]}</td>
          <td
            onClick={() => {
              const newFields = { ...mappedFields };
              delete newFields[key];
              setMappedFields(newFields);
            }}
          >
            x
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const FieldMapping = <T extends any>({
  field,
  value,
  setValue,
}: FieldProps<T>) => {
  const [newValue, setNewValue] = useState("");
  const [mappedFields, setMappedFields] = useState<{
    [key in keyof Contact]?: string;
  }>({});
  const currentFields = Object.keys(mappedFields);
  const missingFields = ContactFields.filter(
    (field) => !currentFields.find((current) => current === field)
  );
  const [selectedField, setSelectedField] = useState<keyof Contact>(
    missingFields[0] as keyof Contact
  );

  const addField = () => {
    setMappedFields({ ...mappedFields, [selectedField]: newValue });
    setNewValue("");
    setSelectedField(missingFields.find((field) => field !== selectedField));
    setValue(JSON.stringify(mappedFields) as T);
  };

  const onKeypress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.stopPropagation();
      event.preventDefault();
      addField();
    }
  };

  return (
    <div className={styles.field}>
      <p>Assign Fields</p>
      <ExistingFieldMappings
        currentFields={currentFields}
        mappedFields={mappedFields}
        setMappedFields={setMappedFields}
      />
      {!!missingFields.length && (
        <div>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value as keyof Contact)}
          >
            {missingFields.map((field) => (
              <option key={field}>{field}</option>
            ))}
          </select>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => onKeypress(e)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() => addField()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

const Field = <T extends any>(props: FieldProps<T>) => {
  // For more integrations, it may be better to move to a map or switch statement
  if (props.field.type === IntegrationType.string) {
    return <StringField {...props} />;
  }

  if (props.field.type === IntegrationType.fieldMapping) {
    return <FieldMapping {...props} />;
  }

  return null;
};

const RemoveIntegration = ({
  integration,
  onYes,
  onNo,
}: {
  integration: IntegrationDetails;
  onYes: () => void;
  onNo: () => void;
}) => {
  return (
    <div className={styles["remove-integration"]}>
      <h1>Remove Integration with {integration.name}?</h1>
      <div>
        <div className={styles.danger} onClick={() => onYes()}>
          Yes
        </div>
        <div className={styles.warning} onClick={() => onNo()}>
          No
        </div>
      </div>
    </div>
  );
};

const setIntegrationField =
  (setState: (val: any) => void, key: string) => (value: string | number) => {
    setState((state: { [key: string]: string | number }) => ({
      ...state,
      [key]: value,
    }));
  };

const IntegrationPage = () => {
  const [integration, setIntegration] = useState<IntegrationDetails>();
  const router = useRouter();

  useEffect(() => {
    if (!router.query.id) {
      return;
    }

    client
      .getIntegration(router.query.id as string)
      .then((value) => setIntegration(value));
  }, [router.query.id, router]);

  if (!integration) {
    return null;
  }

  if (integration.integrated) {
    return (
      <RemoveIntegration
        onYes={() =>
          client.deleteIntegration(integration.id).then(() => router.push("/"))
        }
        onNo={() => router.push("/")}
        integration={integration}
      />
    );
  }

  return <AddIntegration integration={integration} />;
};

const AddIntegration = ({
  integration,
}: {
  integration: IntegrationDetails;
}) => {
  const [currentDetails, setCurrentDetails] = useState<{
    [key: string]: string | number;
  }>({});

  const [error, setError] = useState(false);
  const router = useRouter();

  return (
    <div className={styles["full-height"]}>
      <h1 className={styles.heading}>{integration.name} Integration</h1>
      {error && <h2 className={styles.error}>{error}</h2>}
      <form
        className={styles.form}
        onSubmit={(event) =>
          handleSubmit(event, integration.id, currentDetails)
            .then(() => router.push("/"))
            .catch((err) => setError(err.response?.data))
        }
      >
        <div className={styles.inputs}>
          {integration.fields.map((field) => (
            <Field
              setValue={setIntegrationField(setCurrentDetails, field.name)}
              value={currentDetails[field.name]}
              field={field}
              key={field.id}
            />
          ))}
        </div>
        <input className={styles.button} type="submit" />
      </form>
    </div>
  );
};

export default IntegrationPage;
