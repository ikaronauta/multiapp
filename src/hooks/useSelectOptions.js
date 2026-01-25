import { useEffect, useState } from "react";

export function useSelectOptions(getData, valueOption, textOption) {
  // const [value, setValue] = useState("");
  const [values, setValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [loadingHook, setLoadingHook] = useState(true);
  const [showAlertHook, setShowAlertHook] = useState(false);

  useEffect(() => {
    let mounted = true;

    getData()
      .then((data) => {
        if (!mounted) return;

        if (data?.data) {
          setValues(data.data);
        } else {
          setShowAlertHook(true);
        }
      })
      .catch((error) => {
        if (!mounted) return;
        setShowAlertHook(true);
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        if (mounted) setLoadingHook(false);
      });

    return () => {
      mounted = false;
    };
  }, [getData]);

  useEffect(() => {
    if (values.length > 0) {
      setOptions(
        values.map((item) => ({
          value: item[valueOption],
          text: item[textOption],
        }))
      );
    }
  }, [values]);

  return {
    // value,
    // setValue,
    options,
    loadingHook,
    showAlertHook,
  };
}
