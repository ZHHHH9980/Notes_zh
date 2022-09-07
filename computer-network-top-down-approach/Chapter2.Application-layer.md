# Application-layer



## Lab1: Web Server

```python
# import socket module
from socket import *
import sys  # In order to terminate the program

# Prepare a sever socket
# Fill in start
serverSocket = socket(AF_INET, SOCK_STREAM)
serverPort = 8080

# 疑惑点
serverSocket.bind(('localhost', serverPort))
serverSocket.listen(1)
# Fill in end


if True:
    # Establish the connection
    print('Ready to serve...')
    try:
        # Fill in start
        connectionSocket, addr = serverSocket.accept()
        # Fill in end

        # 从connectSocket接收消息
        message = connectionSocket.recv(4090)
        filename = message.split()[1]

        # 截取fileName，比如 localhost:8080/helloWorld.html -> helloWorld.html
        f = open(filename[1:])
        # 从本地读取文件
        outputdata = f.read() 
        
        # Send one HTTP header line into socket
        # 拼出 header
        header = 'HTTP/1.1 200 OK\nConnection: close\nContent-Type: text/html; charset=utf-8\nContent-Length: %d\n\n' % (
            len(outputdata))
        
        # 发送响应头
        connectionSocket.send(header.encode('utf-8'))

        # Send the content of the requested file to the client
        # 发送html
        for i in range(0, len(outputdata)):
            connectionSocket.send(outputdata[i].encode())
            
        # 末尾换行结束
        connectionSocket.send("\r\n".encode())
        connectionSocket.close()

    except IOError:
        # Send response message for file not found
        # Fill in start
        header = 'HTTP/1.1 404 NOT FOUND'
        connectionSocket.send(header.encode())
        # Fill in end
        # Close client socket
        # Fill in start
        connectionSocket.close()
        # Fill in end
        
serverSocket.close()
sys.exit()  # Terminate the program after sending the corresponding data

```

### 疑惑点

`bind` 方法需要绑定本地IP，本地端口。有些答案会在IP地址里传空字符串

```python
serverSocket.bind(('localhost', serverPort))
```

> [参考](https://docs.python.org/zh-cn/3/howto/sockets.html)
>
> 有几件事需要注意：我们使用了 `socket.gethostname()`，所以套接字将外网可见。如果我们使用的是 `s.bind(('localhost', 80))` 或者 `s.bind(('127.0.0.1', 80))`，也会得到一个「服务端」套接字，但是后者只在同一机器上可见。`s.bind(('', 80))` 则指定套接字可以被机器上的任何地址碰巧连接



