import lightning as L
import os

class YourBackend(L.LightningFlow):
    def __init__(self):
        super().__init__()
        # You can define any state variables here

    def run(self):
        print("Starting the backend service...")
        # The path is now relative to the current directory
        L.app.utilities.subprocess.run(
            "python main.py",
            shell=True
        )

class YourApp(L.LightningApp):
    def __init__(self):
        super().__init__()
        self.backend = YourBackend()

app = YourApp()