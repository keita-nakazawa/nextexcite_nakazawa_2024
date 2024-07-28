from fastapi import FastAPI

app = FastAPI()


@app.get("/fast-api/hello")
def hello_world():
    return {"message": "Hello from FastAPI!"}
