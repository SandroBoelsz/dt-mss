from app.blueprints import viewpoints, home, modularity
from flask import Flask

def create_app():
    app = Flask(__name__)

    app.register_blueprint(home.home_bp)
    app.register_blueprint(viewpoints.viewpoints_bp)
    app.register_blueprint(modularity.modularity_bp)

    return app