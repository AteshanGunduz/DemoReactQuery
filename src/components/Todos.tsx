
import { useTodos, useTodosIds } from "../services/queries"
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from "../services/mutation"
import { SubmitHandler, useForm } from "react-hook-form"
import { Todo } from "../types/todo"


const Todos = () => {

     const todoIdsQuery = useTodosIds()
     const todosQueries = useTodos((todoIdsQuery.data ?? []).filter(id => id !== undefined) as number[])

     if(todoIdsQuery.isPending){
        return <span>Loading..</span>
     }
     if(todoIdsQuery.isError){
        return <span>There is an error..</span>
     }

     const createTodoMutation = useCreateTodo()
     const updateTodoMutation = useUpdateTodo()
     const deleteTodoMutation = useDeleteTodo()

     const {register, handleSubmit} = useForm<Todo>()

     const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) =>{
        createTodoMutation.mutate(data)
     }

     const handleMarkAsDoneSubmit= (data: Todo | undefined) =>{
        if (data) {
            updateTodoMutation.mutate({...data, checked: true})
        }
    
     }

     const handleDeleteTodo = (id: number)=>{
        deleteTodoMutation.mutate(id)
     }


     return (
        <div className="big-container">
          <div className="left">
            <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
              <h4>New Title</h4>
              <input placeholder="Title" {...register("title")} />
              <br />
              <input placeholder="Description" {...register("description")} />
              <br />
              <input
                type="submit"
                disabled={createTodoMutation.isPending}
                value={createTodoMutation.isPending ? "Creating" : "Create todo"}
              />
            </form>
            <p>Query function status: {todoIdsQuery.fetchStatus}</p>
            <p>Query function status: {todoIdsQuery.status}</p>
            <div className="container">
              {todoIdsQuery.data.map((id) => {
                return <div key={id}>id: {id}</div>;
              })}
            </div>
          </div>
      
          <div >
            <ul className="right">
              {todosQueries.map(({ data }) => {
                return (
                  <li key={data?.id}>
                    <div>Id: {data?.id}</div>
                    <span>
                      <strong>Title:</strong> {data?.title},{" "}
                      <strong>Description:</strong> {data?.description}
                    </span>
                    <div>
                      <button
                        className="butttons"
                        onClick={() => handleMarkAsDoneSubmit(data)}
                        disabled={data?.checked}
                      >
                        {data?.checked ? "done" : "mark as done"}
                      </button>

                      {data && data.id && (<button onClick={()=>handleDeleteTodo(data.id!)}>Delete</button>)}
                      
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
}
export default Todos