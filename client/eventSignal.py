class Signal():
    def __init__(self):
        self.__subscribers = set()
    def connect(self, subscriber):
        self.__subscribers.add(subscriber)
    def disconnect(self, subscriber):
        self.__subscribers.discard(subscriber)
    def emit(self, *args, **kwargs):
        for subscriber in self.__subscribers:
            subscriber(*args, **kwargs)
