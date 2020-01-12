# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
#info: NST implementation is based on multiple tutorials.
# We looked at different code bases and following their approches,
# we split the process intot the most important steps and tried to implement the steps ourselves as best as we could
from PIL import Image
import PIL
import tensorflow as tf
import numpy as np
import os 
from tensorflow.keras.applications.vgg19 import VGG19
from tensorflow.python.keras import backend as K
from tensorflow.python.keras.preprocessing import image as kp_image
import tensorflow.keras
import math
import base64
import io


# %%
iteration_number = 500
#Following layers are not definite. We chose layers the original paper on NST selected.
style_layers =   ['block1_conv1','block2_conv1','block3_conv1', 'block4_conv1','block5_conv1']
content_layers = ['block5_conv2'] 
learning_rate =  1e1   # = 10.0
content_weight = 1e3
style_weight = 1e-2
total_variation_weight = 3e-1
tf.compat.v1.enable_eager_execution()

# %%
def image_to_base64(image):
    buff = io.BytesIO()
    image.save(buff, format="JPEG")
    img_bytes = base64.b64encode(buff.getvalue())
    img_str = img_bytes.decode('utf-8')
    return img_str


# %%
#it is important for the images to not be too small, size of 244x244 gave bad results
def load_and_process_img(file):
    max_dim = 512
    #image_dir = os.getcwd() + '/Images/' + file
    #img = Image.open(image_dir)
    img = Image.open(io.BytesIO(base64.b64decode(file)))
    img = img.convert('RGB')
    long = max(img.size)
    scale = max_dim/long
    img = img.resize((round(img.size[0]*scale), round(img.size[1]*scale)), PIL.Image.LANCZOS)#lanczos filter to avoid aliasing
    #preprocessing the image with VGG19-Keras is extremely important for good results
    img = kp_image.img_to_array(img)

    img = tf.keras.applications.vgg19.preprocess_input(img)
    #We need to broadcast the image array such that it has a batch dimension 
    img = np.expand_dims(img, axis=0)
   
    return img


# %%
def convert_to_rgb(img, vgg19_norm_means):
    if len(img.shape) == 4:
        img = img[0, :, :, :]

    img = tf.add(img,vgg19_norm_means) #blue
    rgb_img = img[:, :, ::-1]

    rgb_img = np.clip(rgb_img, 0, 255).astype('uint8')
    return rgb_img


# %%
def init_model(layer_names):
    try:
        vgg19_model = tensorflow.keras.models.load_model('vgg19.h5')
    except OSError as err:
        print("No VGG19 model saved")
        vgg19_model = VGG19(include_top=False, weights='imagenet') 
        vgg19_model.save('vgg19.h5')
    #include_top=false for cutting off fully connected layer
    vgg19_model.trainable = False
    outputs = [vgg19_model.get_layer(name).output for name in layer_names]
    model = tf.keras.Model([vgg19_model.input], outputs)
    return model


# %%
def get_feature_maps(model, image):
    return model(image)


# %%
def create_content_loss(mixed_image, content_model, content_image_feature_maps):
    losses = []
    mixed_image_feature_maps = content_model(mixed_image)

    for content_image_map, mixed_image_map in zip(content_image_feature_maps, mixed_image_feature_maps ):
        loss = tf.reduce_mean(tf.square(content_image_map-mixed_image_map))
        losses.append(loss)
    content_loss = tf.reduce_mean(losses)
    return content_loss


# %%
def gram_matrix(style_img_features_per_layer):
    number_of_feature_maps = int(style_img_features_per_layer.shape[-1]) # or number of channels
    #we want to flatten the matrix in each feature map into one vector to perform a multiplication where every number
    #is multiplied with each other
    flattened_matrix = tf.reshape(style_img_features_per_layer, [-1, number_of_feature_maps]) 
    num_locations = tf.cast(tf.shape(flattened_matrix)[0], tf.float32)
    # [-1,x ]  means that a fitting dimension is automatically chosen to fit every number in
    gram = tf.matmul(flattened_matrix, flattened_matrix, transpose_a=True)
    gram = gram/(num_locations)
    return gram


# %%
def create_style_loss(mixed_image, style_model, gram_style_img_features):
    losses = []
    mixed_image_feature_maps = style_model(mixed_image)    
    gram_matrices_mixed_image = [gram_matrix(mixed_image_feature) for mixed_image_feature in mixed_image_feature_maps]
    # print(tf.executing_eagerly())

    #iterates per layer
    for style_image_gram_matrix, mixed_image_gram in zip(gram_style_img_features, gram_matrices_mixed_image):
        loss = tf.reduce_mean(tf.square(mixed_image_gram - style_image_gram_matrix))
        losses.append(loss)
        
    style_loss = tf.reduce_mean(losses)
    
    return style_loss
    


# %%
def create_total_variation_loss(mixed_image):
    loss = tf.reduce_sum(tf.abs(mixed_image[:,:-1:,:,:] - mixed_image[:,1:,:,:])) +            tf.reduce_sum(tf.abs(mixed_image[:,:,:-1,:] - mixed_image[:,:,1:,:]))
    
    loss = tf.dtypes.cast(loss, tf.float32)
    return loss


# %%
def compute_combined_loss(mixed_image, 
                          content_model, style_model, 
                          content_image_feature_maps,
                          gram_style_img_features
                          ):

    
    style_loss = create_style_loss(mixed_image, style_model, gram_style_img_features)*style_weight
    content_loss = create_content_loss(mixed_image, content_model, content_image_feature_maps)*content_weight
    total_variation_loss = create_total_variation_loss(mixed_image)*total_variation_weight
    
    all_loss = style_loss+content_loss+total_variation_loss
 
    return all_loss


# %%
def style_transfer_main(content_base64, style_base64, evolutionStep):
    #no string as arg, but base64 encoded 
    
    content_img = load_and_process_img(content_base64)
    style_img = load_and_process_img(style_base64)
    
    #content and style model
    content_model = init_model(content_layers)  
    style_model = init_model(style_layers)
    
    #feature maps of content & style image that don't need to be calculated again in each iteration
    content_image_feature_maps = get_feature_maps(content_model, content_img)
    style_image_feature_maps = get_feature_maps(style_model, style_img)
    
    #gram matrices of style image that don't need to be calculated again
    gram_style_img_features = [gram_matrix(style_image_feature) for style_image_feature in style_image_feature_maps]
    
    #init mixed image
    mixed_image = load_and_process_img(content_base64)
    mixed_image = tf.Variable(mixed_image, dtype=tf.float32) #has to be a tf Variable to use it with GradientTape
    
    best_img = None
    lowest_loss =  math.inf 
  
    optimizer = tf.compat.v1.train.AdamOptimizer(learning_rate=10, beta1=0.99, epsilon=1e-1)
    
    vgg19_norm_means = np.array([103.939, 116.779, 123.68]) #reversed RGB--> BGR, e.g. first number is for B channel
    min_vals = -vgg19_norm_means
    max_vals = 255 - vgg19_norm_means

    imageEvolutions = []

    for i in range(iteration_number):
        print(i)
        
        with tf.GradientTape() as tape:
                combined_loss = compute_combined_loss(mixed_image, content_model, style_model, content_image_feature_maps, gram_style_img_features)
        # print(combined_loss)
        gradients = tape.gradient(combined_loss, mixed_image)
        optimizer.apply_gradients([(gradients, mixed_image)])
                
        clipped_rgb_values =  tf.clip_by_value(mixed_image, min_vals, max_vals)
        mixed_image.assign(clipped_rgb_values)
    
         
        if combined_loss < lowest_loss:
            lowest_loss = combined_loss
            best_img = mixed_image
            if i % evolutionStep == 0:
                current = convert_to_rgb(best_img,vgg19_norm_means)
                best_img_base64 = image_to_base64(PIL.Image.fromarray(current))
                imageEvolutions.append(best_img_base64)

    best_img = convert_to_rgb(best_img,vgg19_norm_means)
    best_img_base64 = image_to_base64(PIL.Image.fromarray(best_img))

    return best_img_base64, imageEvolutions

