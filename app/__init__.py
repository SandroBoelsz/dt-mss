from app.blueprints import viewpoints, home, modularity, decomposition, metadata
from flask import Flask


def create_app():
    app = Flask(__name__)

    app.register_blueprint(home.home_bp)
    app.register_blueprint(viewpoints.viewpoints_bp)
    app.register_blueprint(modularity.modularity_bp)
    app.register_blueprint(decomposition.decomposition_bp)
    app.register_blueprint(metadata.metadata_bp)

    return app
