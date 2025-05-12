import { useForm, SubmitHandler, useController } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { UsersResult } from "./types";
import { useRef, useState } from "react";

interface IFormInput {
  userName: string;
}

const schema = Yup.object().shape({
  userName: Yup.string()
    .required("User name is required")
    .max(30, "You can input max 30 characters"),
});

const TIME_INTERVAL = 2000;

export const useSearchUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<UsersResult['items']>([]);
  const [totalItemsLength, setTotalItemsLength] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
    },
    resolver: yupResolver(schema),
  });

  const {error, mutate, isLoading} = useMutation(
    {
      mutationFn: async ({ userName, currentPage }: {
        userName: string;
        currentPage: number;
      }) => {
        try {
          const res = await fetch(
            `https://api.github.com/search/users?q=${userName}&page=${currentPage}`
          );
          const data: UsersResult = await res.json();

          setItems(prevItems => currentPage > 1 ? [...prevItems, ...data.items] : data.items)
          setTotalItemsLength(data.total_count);
    
          return data;
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      },
      onSuccess: () => {
        setCurrentPage(currentPage => currentPage + 1);
      }
    }
  );

  const { field } = useController({
    control,
    rules: { required: true },
    name: "userName",
  });

  const onSubmit: SubmitHandler<IFormInput> = ({userName}) => {
    mutate({ userName, currentPage: 1 })
    setCurrentPage(1);
  };

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    field.onChange(event);

    setIsSearching(!!event.target.value.length)
    if(!event.target.value.length){
      setItems([]);
    }

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
    }, TIME_INTERVAL);
  };

  const goToNextPage = () => {
    handleSubmit(({userName}) => {
      mutate({ userName, currentPage })
    })()
  }

  return {
    onChangeInput,
    value: field.value,
    validationErrors: errors,
    items,
    totalItemsLength,
    isLoading: isLoading || isSearching,
    error,
    goToNextPage,
  }
}