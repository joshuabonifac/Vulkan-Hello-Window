# Vulkan-Hello-Window
A small Vulkan project built without GLFW demonstrating the installation of the Vulkan SDK, explicit library and loader linking, and environment setup.

I chose Vulkan without GLFW as I wanted to understand how computer graphics are engineered at lower-level processes, and avoid the use of operating system layers to understand what creating and testing a program with a graphics API can be like without the library used for Windows.



At the beginning of the project, I manually installed the SDK, which led to setting up the location where my files would be stored. After that, I checked on the environment and system variables to make sure it was set up to run programs efficiently. 



As I began to set up the project in a coding environment, I adjusted the C++ language standard from C++14 to C++20. I went to C/C++ on the property page and added the Vulkan SDK include directory to Additional Include Directories. In Linker, I also added the library of the Vulkan SDK library directory to the Additional Library Directories. For the Vulkan SDK, I also explicitly included the version in order to make the compiler understand what libraries it can locate. 



Last but not least, I added the source code that included the Vulkan header library, the functions, and the try and catch statement if the program failed to run. Although I did have many struggles with boilerplate setup and felt overwhelmed by debugging-especially when learning about validation layers, physical devices, and queues for setup code-I still managed to successfully build and run a system that opens a console window within the Vulkan SDK.



I realized to myself that I'm not the only one who struggles with setup code, and I'm not bad at it. I was going through a tough topic that many successful engineers had gone through. Working through it helped me understand graphics at a deep, low level.
