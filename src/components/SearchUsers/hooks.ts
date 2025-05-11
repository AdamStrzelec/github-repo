import { useForm, SubmitHandler, useController } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "react-query";
import { UsersResult } from "./types";
import { useRef } from "react";

interface IFormInput {
  userName: string;
}

const schema = Yup.object().shape({
  userName: Yup.string()
    .required("User name is required")
    .min(3, "Min. 3 characters required")
    .max(30, "You can input max 30 characters"),
});

const TIME_INTERVAL = 2000;

export const useSearchUsers = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
    },
    resolver: yupResolver(schema),
  });

  const userName = watch("userName");

  const fetchUsers = async (
    userName: string
  ): Promise<Partial<UsersResult>> => {
    try {
      const data = await fetch(
        `https://api.github.com/search/users?q=${userName}`
      ).then((res) => res.json());

      return data;
    } catch (error) {
      console.error(error);

      return {};
    }
  };

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["githubUsers"],
    queryFn: () => fetchUsers(userName),
    enabled: false,
  });

  const { field } = useController({
    control,
    rules: { required: true },
    name: "userName",
  });

  const onSubmit: SubmitHandler<IFormInput> = () => {
    refetch();
  };

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    field.onChange(event);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
    }, TIME_INTERVAL);
  };

  return {
    onChangeInput,
    value: field.value,
    errors,
    data,
    isLoading,
    error,
  }
}